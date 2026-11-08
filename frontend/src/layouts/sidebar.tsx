import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radio, RefreshCw, History, Disc } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Spotify Connection',
    href: '/connection',
    icon: Radio,
  },
  {
    title: 'Sync Engine',
    href: '/sync',
    icon: RefreshCw,
  },
  {
    title: 'Listening History',
    href: '/history',
    icon: History,
  },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card flex flex-col justify-between shrink-0">
      <div className="p-4 space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground flex items-start gap-2">
          <Disc className="h-4 w-4 mt-0.5 text-primary shrink-0" />
          <div>
            <div className="font-semibold text-foreground">MVP Architecture</div>
            <p className="mt-0.5 text-[11px] leading-relaxed">
              Modular Monolith + React 19 SPA. Respects Honest Data Rule & Provider Isolation.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
