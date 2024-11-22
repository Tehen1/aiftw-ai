import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  items: {
    title: string;
    items: {
      title: string;
      href: string;
    }[];
  }[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      {items.map((section, index) => (
        <div key={index} className="pb-8">
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
            {section.title}
          </h4>
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
                pathname === item.href ? 'bg-accent' : 'transparent'
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
