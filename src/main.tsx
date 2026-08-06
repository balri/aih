import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { fetchTestimonials } from "./lib/testimonials.ts";

// Kick off the slow testimonials feed as soon as the app boots, so it's
// already cached by the time the user navigates to the Contact page.
fetchTestimonials();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
