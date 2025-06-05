'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'แดชบอร์ด', href: '/main/dashboard', icon: '🏠' },
  { name: 'รายชื่อเด็ก', href: '/main/children', icon: '👧' },
  { name: 'บันทึกการเจริญเติบโต', href: '/main/growth', icon: '📈' },
  { name: 'ออกจากระบบ', href: '/' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar w-64 text-white p-4 bg-gradient-to-b from-green-600 to-green-800 min-h-screen">
      <ul>
        {menuItems.map((item) => (
          <li key={item.href} className="mb-2">
            <Link
              href={item.href}
              className={cn(
                'sidebar-link flex items-center p-3 rounded transition-all',
                pathname.startsWith(item.href)
                  ? 'bg-white/10 border-l-4 border-yellow-300 font-bold'
                  : 'hover:bg-white/10'
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
