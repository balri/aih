export const config = { runtime: "edge", maxDuration: 60 };

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function areEqual(left: unknown, right: unknown): boolean {
	if (left === right) return true;
	if (Array.isArray(left) || Array.isArray(right)) {
		return (
			Array.isArray(left) &&
			Array.isArray(right) &&
			left.length === right.length &&
			left.every((value, index) => areEqual(value, right[index]))
		);
	}
	if (!isRecord(left) || !isRecord(right)) return false;

	const leftKeys = Object.keys(left);
	const rightKeys = Object.keys(right);
	return (
		leftKeys.length === rightKeys.length &&
		leftKeys.every(
			(key) =>
				Object.hasOwn(right, key) && areEqual(left[key], right[key]),
		)
	);
}

export default async function handler(req: Request): Promise<Response> {
	if (
		req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return new Response("Unauthorized", { status: 401 });
	}

	const endpoint = process.env.TESTIMONIALS_ENDPOINT;
	if (!endpoint) return new Response("Missing endpoint", { status: 500 });

	const edgeConfigId = process.env.EDGE_CONFIG_ID;
	if (!edgeConfigId?.startsWith("ecfg_")) {
		return new Response("Missing or invalid EDGE_CONFIG_ID", {
			status: 500,
		});
	}

	let res: Response | undefined;
	for (let attempt = 0; attempt < 2 && !res?.ok; attempt++) {
		try {
			res = await fetch(endpoint, { signal: AbortSignal.timeout(12500) });
		} catch {
			// transient failure (timeout/network) — fall through to retry or give up
		}
	}
	if (!res?.ok) {
		return new Response(`Upstream ${res?.status ?? "unreachable"}`, {
			status: 502,
		});
	}
	const data = await res.json();

	const edgeConfigItemsUrl = `https://api.vercel.com/v1/global-config/${edgeConfigId}/items`;
	const headers = {
		Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
	};
	const current = await fetch(edgeConfigItemsUrl, { headers });
	if (!current.ok) {
		const detail = await current.text();
		return new Response(
			`Edge Config read failed (${current.status}): ${detail}`,
			{ status: 500 },
		);
	}

	const currentItems: unknown = await current.json();
	if (!Array.isArray(currentItems)) {
		return new Response("Edge Config read failed: invalid response", {
			status: 500,
		});
	}

	const existing = currentItems.find(
		(item: unknown) =>
			typeof item === "object" &&
			item !== null &&
			"key" in item &&
			item.key === "testimonials",
	);
	if (
		typeof existing === "object" &&
		existing !== null &&
		"value" in existing &&
		areEqual(existing.value, data)
	) {
		return new Response("OK");
	}

	const update = await fetch(edgeConfigItemsUrl, {
		method: "PATCH",
		headers: { ...headers, "Content-Type": "application/json" },
		body: JSON.stringify({
			items: [{ operation: "upsert", key: "testimonials", value: data }],
		}),
	});

	if (!update.ok) {
		const detail = await update.text();
		return new Response(
			`Edge Config write failed (${update.status}): ${detail}`,
			{
				status: 500,
			},
		);
	}

	return new Response("OK");
}
