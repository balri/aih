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

	it("fails when the upstream feed errors", async () => {
		process.env.CRON_SECRET = "expected-secret";
		process.env.TESTIMONIALS_ENDPOINT = "https://example.com/exec";
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 500 }),
		);
		const { default: handler } = await import("./refresh-testimonials");

		const res = await handler(buildRequest("expected-secret"));

		expect(res.status).toBe(502);
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
			return { ok: true };
		});
		vi.stubGlobal("fetch", fetchMock);
		const { default: handler } = await import("./refresh-testimonials");

		const res = await handler(buildRequest("expected-secret"));

		expect(res.status).toBe(200);
		expect(fetchMock).toHaveBeenLastCalledWith(
			"https://api.vercel.com/v1/edge-config/ecfg_test/items",
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

	it("fails when the Edge Config write fails", async () => {
		process.env.CRON_SECRET = "expected-secret";
		process.env.TESTIMONIALS_ENDPOINT = "https://example.com/exec";
		process.env.EDGE_CONFIG_ID = "ecfg_test";
		process.env.VERCEL_API_TOKEN = "vercel-token";
		const fetchMock = vi.fn(async (url) => {
			if (url === process.env.TESTIMONIALS_ENDPOINT) {
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
