import { Link } from "react-router-dom";

const bulletins = Array.from({ length: 5 }, (_, i) => ({
  label: `Research Bulletin ${i + 1}: Classification and Analytical Methodologies`,
  slug: `/news/bulletin-${i + 1}`,
}));

export default function News() {
  return (
    <section>
      <div className="wrap">
        <h1>News & Insights</h1>
        <ul>
          {bulletins.map((b) => <li key={b.slug}><Link to={b.slug}>{b.label}</Link></li>)}
        </ul>
      </div>
    </section>
  );
}
