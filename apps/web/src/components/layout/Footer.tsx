import Link from "next/link";
import { Zap, Mail, Twitter, Instagram, Youtube, Github } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "Headphones", href: "/products?category=headphones" },
    { name: "Smartwatches", href: "/products?category=smartwatches" },
    { name: "Earbuds", href: "/products?category=earbuds" },
    { name: "Speakers", href: "/products?category=speakers" },
    { name: "All Products", href: "/products" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Warranty", href: "/warranty" },
    { name: "Order Tracking", href: "/tracking" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/sonica" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/sonica" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/sonica" },
  { name: "GitHub", icon: Github, href: "https://github.com/sonica" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--sonica-border)] bg-[var(--sonica-bg)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="py-12 border-b border-[var(--sonica-border)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold">Stay in the loop</h3>
              <p className="text-sm text-[var(--sonica-text-muted)] mt-1">
                Get the latest on new products, exclusive deals, and tech tips.
              </p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--sonica-text-muted)]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-[var(--sonica-border)] bg-[var(--sonica-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--sonica-text)] placeholder:text-[var(--sonica-text-muted)] focus:border-[var(--sonica-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--sonica-primary)]"
                />
              </div>
              <button className="rounded-lg bg-[var(--sonica-primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--sonica-primary-dark)] transition-colors shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[var(--sonica-border)] py-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[var(--sonica-primary)]" />
            <span className="text-sm font-semibold">Sonica</span>
            <span className="text-sm text-[var(--sonica-text-muted)]">
              &copy; {new Date().getFullYear()} All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
                aria-label={social.name}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
