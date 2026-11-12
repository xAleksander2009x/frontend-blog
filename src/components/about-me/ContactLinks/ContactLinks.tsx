import { Section } from "@gi-org-pl/athena";

export interface ContactLinkItem {
  label: string;
  href: string;
}

export interface ContactLinksProps {
  title: string;
  links: ContactLinkItem[];
}

const ContactLinks = ({ title, links }: ContactLinksProps) => {
  return (
    <Section title={title}>
      <nav aria-label="Contact links">
        <ul className="flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-gi-dark-ash bg-card px-4 py-2 text-sm font-medium text-gi-primary transition-colors hover:bg-gi-light-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gi-primary focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
  );
};

export default ContactLinks;
