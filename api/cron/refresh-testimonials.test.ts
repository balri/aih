const originalEnv = { ...process.env };

function buildRequest(secret?: string) {
	return new Request("https://example.com/api/cron/refresh-testimonials", {
		headers: secret ? { authorization: `Bearer ${secret}` } : {},
	});
}

describe("GET /api/cron/refresh-testimonials", () => {
	afterEach(() => {
		process.env = { ...originalEnv };
		vi.unstubAllGlobals();
		vi.resetModules();
	});

	it("rejects requests without a matching CRON_SECRET", async () => {
		process.env.CRON_SECRET = "expected-secret";
		const { default: handler } = await import("./refresh-testimonials");

		const res = await handler(buildRequest("wrong-secret"));

		expect(res.status).toBe(401);
	});

	it("fails when no upstream endpoint is configured", async () => {
		process.env.CRON_SECRET = "expected-secret";
		delete process.env.TESTIMONIALS_ENDPOINT;
		const { default: handler } = await import("./refresh-testimonials");

		const res = await handler(buildRequest("expected-secret"));

		expect(res.status).toBe(500);
	});

	it.each([undefined, "not-an-edge-config-id"])(
		"fails clearly when EDGE_CONFIG_ID is missing or invalid (%s)",
		async (edgeConfigId) => {
			process.env.CRON_SECRET = "expected-secret";
			process.env.TESTIMONIALS_ENDPOINT = "https://example.com/exec";
			if (edgeConfigId) {
				process.env.EDGE_CONFIG_ID = edgeConfigId;
			} else {
				delete process.env.EDGE_CONFIG_ID;
			}
			const fetchMock = vi.fn();
			vi.stubGlobal("fetch", fetchMock);
			const { default: handler } = await import("./refresh-testimonials");

			const res = await handler(buildRequest("expected-secret"));

			expect(res.status).toBe(500);
			expect(await res.text()).toBe("Missing or invalid EDGE_CONFIG_ID");
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it("fails when the upstream feed errors", async () => {
		process.env.CRON_SECRET = "expected-secret";
		process.env.TESTIMONIALS_ENDPOINT = "https://example.com/exec";
		process.env.EDGE_CONFIG_ID = "ecfg_test";
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 500 }),
		);
		const { default: handler } = await import("./refresh-testimonials");

		const res = await handler(buildRequest("expected-secret"));

		expect(res.status).toBe(502);
	});

	it("retries the upstream fetch once before succeeding", async () => {
		process.env.CRON_SECRET = "expected-secret";
		process.env.TESTIMONIALS_ENDPOINT = "https://example.com/exec";
		process.env.EDGE_CONFIG_ID = "ecfg_test";
		process.env.VERCEL_API_TOKEN = "vercel-token";
		let upstreamCalls = 0;
		const fetchMock = vi.fn(async (url) => {
			if (url === process.env.TESTIMONIALS_ENDPOINT) {
				upstreamCalls++;
				if (upstreamCalls === 1) throw new Error("network blip");
				return { ok: true, json: async () => [] };
			}
			return { ok: true, json: async () => [] };
		});
		vi.stubGlobal("fetch", fetchMock);
		const { default: handler } = await import("./refresh-testimonials");

		const res = await handler(buildRequest("expected-secret"));

		expect(res.status).toBe(200);
		expect(upstreamCalls).toBe(2);
	});

	it("writes the feed to Edge Config on success", async () => {
		process.env.CRON_SECRET = "expected-secret";
		process.env.TESTIMONIALS_ENDPOINT = "https://example.com/exec";
		process.env.EDGE_CONFIG_ID = "ecfg_test";
		process.env.VERCEL_API_TOKEN = "vercel-token";
		const fetchMock = vi.fn(async (url) => {
			if (url === process.env.TESTIMONIALS_ENDPOINT) {
				return {
					ok: true,
					json: async () => [{ name: "Jane Doe", rating: 5 }],
				};
			}
			if (url.endsWith("/items")) {
				return { ok: true, json: async () => [] };
			}
			return { ok: true };
		});
		vi.stubGlobal("fetch", fetchMock);
		const { default: handler } = await import("./refresh-testimonials");

		const res = await handler(buildRequest("expected-secret"));

		expect(res.status).toBe(200);
		expect(fetchMock).toHaveBeenLastCalledWith(
			"https://api.vercel.com/v1/global-config/ecfg_test/items",
			expect.objectContaining({
				method: "PATCH",
				headers: expect.objectContaining({
					Authorization: "Bearer vercel-token",
				}),
				body: JSON.stringify({
					items: [
						{
							operation: "upsert",
							key: "testimonials",
							value: [{ name: "Jane Doe", rating: 5 }],
						},
					],
				}),
			}),
		);
	});

	it("does not write the feed when Edge Config already has the same value", async () => {
		process.env.CRON_SECRET = "expected-secret";
		process.env.TESTIMONIALS_ENDPOINT = "https://example.com/exec";
		process.env.EDGE_CONFIG_ID = "ecfg_test";
		process.env.VERCEL_API_TOKEN = "vercel-token";
		const feed = [{ name: "Jane Doe", rating: 5 }];
		const fetchMock = vi.fn(async (url) => {
			if (url === process.env.TESTIMONIALS_ENDPOINT) {
				return { ok: true, json: async () => feed };
			}
			return {
				ok: true,
				json: async () => [
					{
						key: "testimonials",
						value: [{ rating: 5, name: "Jane Doe" }],
					},
				],
			};
		});
		vi.stubGlobal("fetch", fetchMock);
		const { default: handler } = await import("./refresh-testimonials");

		const res = await handler(buildRequest("expected-secret"));

		expect(res.status).toBe(200);
		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(fetchMock).toHaveBeenLastCalledWith(
			"https://api.vercel.com/v1/global-config/ecfg_test/items",
			{ headers: { Authorization: "Bearer vercel-token" } },
		);
	});

	it("fails when the Edge Config write fails", async () => {
		process.env.CRON_SECRET = "expected-secret";
		process.env.TESTIMONIALS_ENDPOINT = "https://example.com/exec";
		process.env.EDGE_CONFIG_ID = "ecfg_test";
		process.env.VERCEL_API_TOKEN = "vercel-token";
		const fetchMock = vi.fn(async (url, init) => {
			if (url === process.env.TESTIMONIALS_ENDPOINT) {
				return { ok: true, json: async () => [] };
			}
			if (init?.method !== "PATCH") {
				return { ok: true, json: async () => [] };
			}
			return { ok: false, status: 403, text: async () => "Forbidden" };
		});
		vi.stubGlobal("fetch", fetchMock);
		const { default: handler } = await import("./refresh-testimonials");

		const res = await handler(buildRequest("expected-secret"));

		expect(res.status).toBe(500);
	});
});
