import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChart3, Heart, LogOut, ShoppingCart, Store, User, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

const navLinks = (currentUser, cartItemCount) => [
  {
    to: '/',
    icon: Store,
    label: 'Shop Products',
    always: true,
  },
  {
    to: '/wishlist',
    icon: Heart,
    label: 'My Wishlist',
    requiresAuth: true,
  },
  {
    to: '/cart',
    icon: ShoppingCart,
    label: 'Shopping Cart',
    always: true,
    badge: cartItemCount > 0 ? cartItemCount : null,
  },
  {
    to: '/profile',
    icon: User,
    label: 'Profile & Wallet',
    requiresAuth: true,
  },
  {
    to: '/dashboard',
    icon: BarChart3,
    label: 'Management Panel',
    requiresRole: ['seller', 'admin'],
  },
];

export default function Sidebar({ currentUser, cartItemCount, onLogout, open, onClose }) {
  const links = navLinks(currentUser, cartItemCount).filter((link) => {
    if (link.requiresAuth && !currentUser) return false;
    if (link.requiresRole && (!currentUser || !link.requiresRole.includes(currentUser.role)))
      return false;
    return true;
  });

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-screen flex-col',
          'w-[260px] bg-[var(--color-sidebar)] border-r border-[var(--color-sidebar-border)]',
          'transition-transform duration-300 ease-in-out',
          // Desktop: always visible
          'lg:translate-x-0',
          // Mobile: controlled by open prop
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 border-b border-[var(--color-sidebar-border)] h-[68px] shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[rgba(99,102,241,0.2)] border border-[rgba(99,102,241,0.3)]">
            <Store size={18} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <span
              className="font-[var(--font-display)] font-bold text-base text-[var(--color-foreground)] gradient-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Antigravity
            </span>
            <span className="text-[var(--color-muted-foreground)] text-base font-semibold ml-1">
              Market
            </span>
          </div>

          {/* Mobile close button */}
          <button
            className="ml-auto lg:hidden p-1.5 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) => cn('nav-item group', isActive && 'active')}
            >
              <Icon size={17} className="shrink-0" />
              <span className="flex-1 truncate">{label}</span>
              {badge != null && (
                <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer: User Info or Sign In */}
        <div className="shrink-0 border-t border-[var(--color-sidebar-border)] p-4 space-y-3">
          {currentUser ? (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {(currentUser.name || currentUser.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--color-foreground)] truncate">
                    {currentUser.name || currentUser.username}
                  </p>
                  <p className="text-[10px] text-[var(--color-muted-foreground)] uppercase tracking-wider font-semibold">
                    {currentUser.role}
                  </p>
                </div>
              </div>
              <Button variant="destructive" size="sm" className="w-full" onClick={onLogout}>
                <LogOut size={14} />
                Log Out
              </Button>
            </>
          ) : (
            <Link to="/auth" className="block">
              <Button variant="default" size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
