const leadership = [
  'Dr Sarah Jennings – Managing Director',
  'Michael Hart – Director of Operations',
  'Rebecca Clarke – Director of Research',
  'David Nguyen – Principal Security Consultant',
  'Emma Wilson – Governance Manager',
  'James Peterson – Training Director',
];

export default function Team() {
  return (
    <section>
      <div className="wrap">
        <h1>Our Team</h1>
        <img className="team" src="/team_photo.png" alt="Team Photo" />
        <h2>Leadership</h2>
        <ul>
          {leadership.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
