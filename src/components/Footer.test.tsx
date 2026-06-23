import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
	it("renders the footer landmark", () => {
		render(<Footer />);
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});

	it("displays the organisation name", () => {
		render(<Footer />);
		expect(screen.getByRole("contentinfo")).toHaveTextContent(
			"Applied Information Heritage",
		);
	});
});
