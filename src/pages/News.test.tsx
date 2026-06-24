import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import News from "./News";

function renderNews() {
	return render(
		<MemoryRouter>
			<News />
		</MemoryRouter>,
	);
}

describe("News", () => {
	it("renders 6 bulletin links", () => {
		renderNews();
		expect(screen.getAllByRole("link")).toHaveLength(6);
	});

	it("each link points to the correct slug", () => {
		renderNews();
		expect(
			screen.getByRole("link", {
				name: "Press Release: Annual Symposium 2026",
			}),
		).toHaveAttribute("href", "/news/press-release-annual-symposium-2026");
		for (let i = 1; i <= 5; i++) {
			expect(
				screen.getByRole("link", {
					name: `Research Bulletin ${i}: Classification and Analytical Methodologies`,
				}),
			).toHaveAttribute(
				"href",
				`/news/research-bulletin-${i}-classification-and-analytical-methodologies`,
			);
		}
	});
});
