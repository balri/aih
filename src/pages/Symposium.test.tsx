import { render, screen } from "@testing-library/react";
import Symposium from "./Symposium";

describe("Symposium", () => {
	it("renders all session topics", () => {
		render(<Symposium />);
		const topics = [
			"Classification Systems in Practice",
			"Patterns in Large Information Collections",
			"Lessons from Historical Information Analysis",
			"Distinguishing Signal from Noise",
		];
		for (const topic of topics) {
			expect(screen.getByText(topic)).toBeInTheDocument();
		}
	});
});
