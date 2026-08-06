import { render, screen, waitFor } from "@testing-library/react";

describe("Testimonials", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.resetModules();
	});

	it("renders nothing when the feed has no approved testimonials", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: true, json: async () => [] }),
		);
		const { default: Testimonials } = await import("./Testimonials");
		render(<Testimonials />);

		await waitFor(() =>
			expect(screen.queryByRole("status")).not.toBeInTheDocument(),
		);
		expect(
			screen.queryByText("What People Are Saying"),
		).not.toBeInTheDocument();
	});

	it("shows a loading indicator while the feed is fetching", async () => {
		let resolveFetch: (value: unknown) => void = () => {};
		vi.stubGlobal(
			"fetch",
			vi.fn(
				() =>
					new Promise((resolve) => {
						resolveFetch = resolve;
					}),
			),
		);
		const { default: Testimonials } = await import("./Testimonials");
		render(<Testimonials />);

		expect(screen.getByRole("status")).toBeInTheDocument();

		resolveFetch({ ok: true, json: async () => [] });
		await waitFor(() =>
			expect(screen.queryByRole("status")).not.toBeInTheDocument(),
		);
	});

	it("renders approved testimonials from the configured endpoint", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => [
					{
						name: "Jane Doe",
						rating: 5,
						testimonial: "Excellent work.",
					},
					{ name: "John Smith", rating: 4, testimonial: "" },
				],
			}),
		);
		const { default: Testimonials } = await import("./Testimonials");
		render(<Testimonials />);

		await waitFor(() =>
			expect(screen.getByText(/Excellent work\./)).toBeInTheDocument(),
		);
		expect(screen.getByText("— Jane Doe")).toBeInTheDocument();
		expect(screen.getByText("— John Smith")).toBeInTheDocument();
		expect(screen.getByLabelText("5 out of 5 stars")).toBeInTheDocument();
		expect(screen.getByLabelText("4 out of 5 stars")).toBeInTheDocument();
	});
});
