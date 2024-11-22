import Link from 'next/link';

const footerLinks = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Documentation', href: '/docs' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
  social: [
    { name: 'Twitter', href: 'https://twitter.com/aiftw' },
    { name: 'GitHub', href: 'https://github.com/aiftw' },
    { name: 'Discord', href: 'https://discord.gg/aiftw' },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t py-12 md:py-16 lg:py-24">
      <div className="container grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-4 text-lg font-medium">Product</h3>
          <ul className="space-y-3">
            {footerLinks.product.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">Company</h3>
          <ul className="space-y-3">
            {footerLinks.company.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">Legal</h3>
          <ul className="space-y-3">
            {footerLinks.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">Social</h3>
          <ul className="space-y-3">
            {footerLinks.social.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container mt-12 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{' '}
            <a
              href="https://aiftw.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              AIFTW
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
