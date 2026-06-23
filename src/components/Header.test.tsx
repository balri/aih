import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

function renderHeader() {
	return render(
		<MemoryRouter>
			<Header />
		</MemoryRouter>,
	);
}

describe("Header", () => {
	it("renders the header landmark", () => {
		renderHeader();
		expect(screen.getByRole("banner")).toBeInTheDocument();
	});

	it("renders all navigation links", () => {
		renderHeader();
		const labels = [
			"Home",
			"About",
			"Team",
			"Services",
			"Symposium",
			"News",
			"Resources",
			"Careers",
			"Contact",
		];
		for (const label of labels) {
			expect(
				screen.getByRole("link", { name: label }),
			).toBeInTheDocument();
		}
	});
});
