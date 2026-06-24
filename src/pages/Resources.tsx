import { Link } from "react-router-dom";

const items = [
	{
		label: "Classification Framework Design Guide (PDF)",
		slug: "/resources/classification-framework-design-guide",
	},
	{
		label: "Information Governance Maturity Model",
		slug: "/resources/information-governance-maturity-model",
	},
	{
		label: "Analytical Methodologies Review",
		slug: "/resources/analytical-methodologies-review",
	},
	{
		label: "Historical Perspectives on Information Management",
		slug: "/resources/historical-perspectives-on-information-management",
	},
];

export default function Resources() {
	return (
		<section>
			<div className="wrap">
				<h1>Resources</h1>
				<ul>
					{items.map((item) => (
						<li key={item.slug}>
							<Link to={item.slug}>{item.label}</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
