export const config = { runtime: "edge", maxDuration: 60 };

export default async function handler(req: Request): Promise<Response> {
	if (
		req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return new Response("Unauthorized", { status: 401 });
	}

	const endpoint = process.env.TESTIMONIALS_ENDPOINT;
	if (!endpoint) return new Response("Missing endpoint", { status: 500 });

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

	const update = await fetch(
		`https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`,
		{
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				items: [
					{ operation: "upsert", key: "testimonials", value: data },
				],
			}),
		},
	);

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
