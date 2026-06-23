import { render, screen } from "@testing-library/react";
import Team from "./Team";

describe("Team", () => {
	it("renders all leadership members", () => {
		render(<Team />);
		const members = [
			"Dr Sarah Jennings – Managing Director",
			"Michael Hart – Director of Operations",
			"Rebecca Clarke – Director of Research",
			"David Nguyen – Principal Security Consultant",
			"Emma Wilson – Governance Manager",
			"James Peterson – Training Director",
		];
		for (const member of members) {
			expect(screen.getByText(member)).toBeInTheDocument();
		}
	});

	it("renders the team photo", () => {
		render(<Team />);
		expect(
			screen.getByRole("img", { name: "Team Photo" }),
		).toBeInTheDocument();
	});
});
