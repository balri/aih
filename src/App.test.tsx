import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
	it("renders header, main, and footer", () => {
		render(<App />);
		expect(screen.getByRole("banner")).toBeInTheDocument();
		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});

	it("renders the home route by default", () => {
		render(<App />);
		expect(screen.getByRole("main")).toBeInTheDocument();
	});
});
