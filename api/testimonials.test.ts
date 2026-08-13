const getMock = vi.fn();

vi.mock("@vercel/global-config", () => ({
	get: getMock,
}));

describe("GET /api/testimonials", () => {
	afterEach(() => {
		vi.resetModules();
		getMock.mockReset();
	});

	it("returns the cached feed from Edge Config", async () => {
		getMock.mockResolvedValue([{ name: "Jane Doe", rating: 5 }]);
		const { default: handler } = await import("./testimonials");

		const res = await handler();

		expect(await res.json()).toEqual([{ name: "Jane Doe", rating: 5 }]);
		expect(res.headers.get("cache-control")).toContain("s-maxage=86400");
	});

	it("returns an empty, briefly-cached list when Edge Config has no value yet", async () => {
		getMock.mockResolvedValue(undefined);
		const { default: handler } = await import("./testimonials");

		const res = await handler();

		expect(await res.json()).toEqual([]);
		expect(res.headers.get("cache-control")).toContain("s-maxage=60");
	});
});
