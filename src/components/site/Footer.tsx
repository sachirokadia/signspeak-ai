import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const groups = [
  {
    title: "Product",
    links: [
      { to: "/features", label: "Features" },
      { to: "/dashboard", label: "Dashboard" },
      { to: "/history", label: "History" },
      { to: "/settings", label: "Settings" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface" aria-labelledby="footer-heading">
      <div className="section-container grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <h2 id="footer-heading" className="sr-only">
            Footer
          </h2>
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-6 text-muted-foreground">
            Real-time gesture recognition that turns hand signs into text and natural speech — built for
            non-verbal communication, on any device with a camera.
          </p>
        </div>

        {groups.map((group) => (
          <nav key={group.title} aria-label={`${group.title} links`}>
            <h3 className="text-sm font-semibold leading-5">{group.title}</h3>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm leading-5 text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="section-container flex flex-col gap-4 py-6 text-xs leading-4 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SignSpeak AI. Communication belongs to everyone.</p>
          <p>WCAG 2.2 AA · On-device inference · Privacy first</p>
        </div>
      </div>
    </footer>
  );
}
