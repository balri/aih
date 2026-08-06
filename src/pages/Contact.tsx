import Testimonials from "../components/Testimonials";

export default function Contact() {
	return (
		<>
			<section>
				<div className="wrap">
					<h1>Feedback</h1>
					<p>
						We'd love to hear about your experience working with
						AIH. Your feedback helps us improve, and with your
						permission we may feature it as a testimonial below.
					</p>
					<p>
						<a
							href="https://docs.google.com/forms/d/e/1FAIpQLSfTh7RmGCjA-FwwU94CN4bU3sTwoNQWZTLxkqUnxDM8VjIk4g/viewform"
							target="_blank"
							rel="noopener noreferrer"
						>
							Share Your Feedback
						</a>
					</p>
				</div>
			</section>
			<Testimonials />
		</>
	);
}
