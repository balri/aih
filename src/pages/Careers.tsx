const roles = [
  'Graduate Analyst',
  'Information Governance Specialist',
  'Security Consultant',
  'Research Associate',
];

export default function Careers() {
  return (
    <section>
      <div className="wrap">
        <h1>Current Opportunities</h1>
        <p>There are currently no advertised vacancies.</p>
        <p>Typical roles at AIH include:</p>
        <ul>
          {roles.map((role) => <li key={role}>{role}</li>)}
        </ul>
      </div>
    </section>
  );
}
