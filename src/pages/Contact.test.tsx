import { render, screen } from "@testing-library/react";
import Contact from "./Contact";

describe("Contact", () => {
	it("frames the page around feedback and links to the form", () => {
		render(<Contact />);
		expect(screen.getByText("Feedback")).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Share Your Feedback" }),
		).toHaveAttribute(
			"href",
			"https://docs.google.com/forms/d/e/1FAIpQLSfTh7RmGCjA-FwwU94CN4bU3sTwoNQWZTLxkqUnxDM8VjIk4g/viewform",
		);
	});
});
