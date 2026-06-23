const topics = [
	"Classification Systems in Practice",
	"Patterns in Large Information Collections",
	"Lessons from Historical Information Analysis",
	"Distinguishing Signal from Noise",
];

export default function Symposium() {
	return (
		<section>
			<div className="wrap">
				<h1>Annual Information Heritage Symposium 2026</h1>
				<p>
					The symposium brings together professionals from government,
					academia and industry.
				</p>
				<h3>Session Topics</h3>
				<ul>
					{topics.map((t) => (
						<li key={t}>{t}</li>
					))}
				</ul>
				<p>
					The conference concludes with a commemorative group
					photograph featuring delegates and presenters.
				</p>
			</div>
		</section>
	);
}
