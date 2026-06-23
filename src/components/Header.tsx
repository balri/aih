import { useState } from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
	{ to: "/", label: "Home" },
	{ to: "/about", label: "About" },
	{ to: "/team", label: "Team" },
	{ to: "/services", label: "Services" },
	{ to: "/symposium", label: "Symposium" },
	{ to: "/news", label: "News" },
	{ to: "/resources", label: "Resources" },
	{ to: "/careers", label: "Careers" },
	{ to: "/contact", label: "Contact" },
];

export default function Header() {
	const [open, setOpen] = useState(false);

	return (
		<header>
			<div className="wrap top">
				<div className="logo">
					AI<span>H</span>
				</div>
				<button
					className="nav-toggle"
					aria-label={open ? "Close menu" : "Open menu"}
					aria-expanded={open}
					onClick={() => setOpen((o) => !o)}
				>
					<span />
					<span />
					<span />
				</button>
				<nav className={open ? "nav-open" : ""}>
					{navLinks.map(({ to, label }) => (
						<NavLink
							key={to}
							to={to}
							end={to === "/"}
							onClick={() => setOpen(false)}
						>
							{label}
						</NavLink>
					))}
				</nav>
			</div>
		</header>
	);
}
