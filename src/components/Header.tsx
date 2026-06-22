import { NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/team', label: 'Team' },
  { to: '/services', label: 'Services' },
  { to: '/symposium', label: 'Symposium' },
  { to: '/news', label: 'News' },
  { to: '/resources', label: 'Resources' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  return (
    <header>
      <div className="wrap top">
        <div className="logo">AI<span>H</span></div>
        <nav>
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
