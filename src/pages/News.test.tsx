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
	it("renders 5 bulletin links", () => {
		renderNews();
		expect(screen.getAllByRole("link")).toHaveLength(5);
	});

	it("each link points to the correct slug", () => {
		renderNews();
		for (let i = 1; i <= 5; i++) {
			expect(
				screen.getByRole("link", {
					name: `Research Bulletin ${i}: Classification and Analytical Methodologies`,
				}),
			).toHaveAttribute("href", `/news/bulletin-${i}`);
		}
	});
});
