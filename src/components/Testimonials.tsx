import { useEffect, useState } from "react";
import { fetchTestimonials } from "../lib/testimonials";
import type { Testimonial } from "../lib/testimonials";

function starRating(rating: number) {
	const filled = Math.min(5, Math.max(0, Math.round(rating)));
	return "★".repeat(filled) + "☆".repeat(5 - filled);
}

export default function Testimonials() {
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		fetchTestimonials()
			.then((data) => {
				if (!cancelled) setTestimonials(data ?? []);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	if (loading) {
		return (
			<section>
				<div className="wrap">
					<h2>What People Are Saying</h2>
					<div
						className="spinner"
						role="status"
						aria-label="Loading testimonials"
					/>
				</div>
			</section>
		);
	}

	if (testimonials.length === 0) {
		return null;
	}

	return (
		<section>
			<div className="wrap">
				<h2>What People Are Saying</h2>
				<div className="cards">
					{testimonials.map((t) => (
						<blockquote
							className="card testimonial"
							key={`${t.name}-${t.rating}-${t.testimonial ?? ""}`}
						>
							<p
								className="rating"
								aria-label={`${t.rating} out of 5 stars`}
							>
								{starRating(t.rating)}
							</p>
							{t.testimonial && (
								<p>&ldquo;{t.testimonial}&rdquo;</p>
							)}
							<cite>— {t.name.trim()}</cite>
						</blockquote>
					))}
				</div>
			</div>
		</section>
	);
}
