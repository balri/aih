import { Link } from "react-router-dom";

const bulletins = Array.from({ length: 5 }, (_, i) => ({
	label: `Research Bulletin ${i + 1}: Classification and Analytical Methodologies`,
	slug: `/news/research-bulletin-${i + 1}-classification-and-analytical-methodologies`,
}));

export default function News() {
	return (
		<section>
			<div className="wrap">
				<h1>News & Insights</h1>
				<ul>
					<li>
						<Link to="/news/press-release-annual-symposium-2026">
							Press Release: Annual Symposium 2026
						</Link>
					</li>
					{bulletins.map((b) => (
						<li key={b.slug}>
							<Link to={b.slug}>{b.label}</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
