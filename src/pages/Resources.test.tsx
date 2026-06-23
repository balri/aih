import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Resources from "./Resources";

function renderResources() {
	return render(
		<MemoryRouter>
			<Resources />
		</MemoryRouter>,
	);
}

describe("Resources", () => {
	it("renders 4 resource links", () => {
		renderResources();
		expect(screen.getAllByRole("link")).toHaveLength(4);
	});

	it("renders each resource with the correct href", () => {
		renderResources();
		const expected = [
			{
				label: "Classification Framework Design Guide (PDF)",
				href: "/resources/classification-framework",
			},
			{
				label: "Information Governance Maturity Model",
				href: "/resources/governance-maturity-model",
			},
			{
				label: "Analytical Methodologies Review",
				href: "/resources/analytical-methodologies",
			},
			{
				label: "Historical Perspectives on Information Management",
				href: "/resources/historical-perspectives",
			},
		];
		for (const { label, href } of expected) {
			expect(screen.getByRole("link", { name: label })).toHaveAttribute(
				"href",
				href,
			);
		}
	});
});
