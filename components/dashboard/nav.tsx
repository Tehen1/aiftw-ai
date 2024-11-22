import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { 
  Home,
  MessageSquare,
  Settings,
  BarChart,
  Users,
  FileText,
  HelpCircle
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: any;
}

const items: NavItem[] = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Chatbots',
    href: '/dashboard/chatbots',
    icon: MessageSquare,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart,
  },
  {
    title: 'Team',
    href: '/dashboard/team',
    icon: Users,
  },
  {
    title: 'Docs',
    href: '/dashboard/docs',
    icon: FileText,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'Support',
    href: '/support',
    icon: HelpCircle,
  },
];

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="inline-block font-bold">AIFTW</span>
      </Link>
      <nav className="flex gap-6">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center text-sm font-medium text-muted-foreground',
            'transition-colors hover:text-primary'
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/chat"
          className={cn(
            'flex items-center text-sm font-medium text-muted-foreground',
            'transition-colors hover:text-primary'
          )}
        >
          Chat
        </Link>
      </nav>
    </div>
  );
}

export function UserNav() {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/dashboard/settings"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'hover:bg-transparent'
        )}
      >
        <Settings className="h-5 w-5" />
        <span className="sr-only">Settings</span>
      </Link>
      <Link
        href="/auth/signout"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'hover:bg-transparent'
        )}
      >
        Sign Out
      </Link>
    </div>
  );
}

export function DashboardNav() {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          item.href && (
            <Link
              key={index}
              href={item.href}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                path === item.href
                  ? 'bg-muted hover:bg-muted'
                  : 'hover:bg-transparent hover:underline',
                'justify-start'
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          )
        );
      })}
    </nav>
  );
}
