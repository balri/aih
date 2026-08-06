describe("GET /api/testimonials", () => {
	const originalEndpoint = process.env.TESTIMONIALS_ENDPOINT;

	afterEach(() => {
		process.env.TESTIMONIALS_ENDPOINT = originalEndpoint;
		vi.unstubAllGlobals();
		vi.resetModules();
	});

	it("returns an empty, briefly-cached list when no endpoint is configured", async () => {
		delete process.env.TESTIMONIALS_ENDPOINT;
		const { default: handler } = await import("./testimonials");

		const res = await handler();

		expect(await res.json()).toEqual([]);
		expect(res.headers.get("cache-control")).toContain("s-maxage=60");
	});

	it("proxies and caches the feed when the endpoint responds", async () => {
		process.env.TESTIMONIALS_ENDPOINT = "https://example.com/exec";
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => [{ name: "Jane Doe", rating: 5 }],
			}),
		);
		const { default: handler } = await import("./testimonials");

		const res = await handler();

		expect(await res.json()).toEqual([{ name: "Jane Doe", rating: 5 }]);
		expect(res.headers.get("cache-control")).toContain("s-maxage=86400");
	});

	it("falls back to an empty, briefly-cached list when the upstream feed fails", async () => {
		process.env.TESTIMONIALS_ENDPOINT = "https://example.com/exec";
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 500 }),
		);
		const { default: handler } = await import("./testimonials");

		const res = await handler();

		expect(await res.json()).toEqual([]);
		expect(res.headers.get("cache-control")).toContain("s-maxage=60");
	});
});
