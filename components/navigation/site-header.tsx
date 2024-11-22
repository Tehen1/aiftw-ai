import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const navigation = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Features',
    href: '/features',
  },
  {
    name: 'Pricing',
    href: '/pricing',
  },
  {
    name: 'Documentation',
    href: '/docs',
  },
  {
    name: 'Blog',
    href: '/blog',
  },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">AIFTW</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-foreground/60'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signin">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
