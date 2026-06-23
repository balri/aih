import { render, screen } from "@testing-library/react";
import Careers from "./Careers";

describe("Careers", () => {
	it("renders all roles", () => {
		render(<Careers />);
		const roles = [
			"Graduate Analyst",
			"Information Governance Specialist",
			"Security Consultant",
			"Research Associate",
		];
		for (const role of roles) {
			expect(screen.getByText(role)).toBeInTheDocument();
		}
	});
});
