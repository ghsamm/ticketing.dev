import Link from "next/link";

const Header = ({ currentUser }) => {
  const linksConfig = [
    { label: "Sign Up", href: "/auth/signup", showWhenConnected: false },
    { label: "Sign In", href: "/auth/signin", showWhenConnected: false },
    { label: "Sell Tickets", href: "/tickets/new", showWhenConnected: true },
    { label: "My Orders", href: "/orders", showWhenConnected: true },
    { label: "Sign Out", href: "/auth/signout", showWhenConnected: true },
  ];

  const links = linksConfig
    .filter((el) => Boolean(currentUser) === Boolean(el.showWhenConnected))
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
