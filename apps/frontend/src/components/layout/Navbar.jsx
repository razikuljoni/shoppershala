import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight, Menu, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Shop Products',
  '/wishlist': 'My Wishlist',
  '/cart': 'Shopping Cart',
  '/checkout': 'Checkout',
  '/profile': 'Profile & Wallet',
  '/dashboard': 'Management Panel',
};

export default function Navbar({ currentUser, onMenuToggle }) {
  const location = useLocation();

  const title =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith('/product/') ? 'Product Details' : 'Shoppershala');

  return (
    <header className="sticky top-0 z-30 flex items-center h-[68px] px-4 md:px-6 gap-4 border-b border-[var(--color-border)] bg-[rgba(4,6,10,0.85)] backdrop-blur-xl">
      {/* Hamburger — mobile */}
      <button
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
        onClick={onMenuToggle}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Page Title Breadcrumb */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-[var(--color-muted-foreground)] text-xs hidden sm:block">
          Antigravity
        </span>
        <ChevronRight size={12} className="text-[var(--color-muted-foreground)] hidden sm:block" />
        <h1
          className="text-base font-bold text-[var(--color-foreground)] truncate"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h1>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {currentUser && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)]">
            <Wallet size={14} className="text-[var(--color-primary)]" />
            <span className="text-sm font-bold text-[var(--color-foreground)]">
              ${(currentUser.balance || 0).toFixed(2)}
            </span>
          </div>
        )}

        {currentUser ? (
          <Link to="/profile" title="Go to Profile">
            <Avatar className="h-9 w-9 ring-2 ring-transparent hover:ring-[var(--color-primary)] transition-all duration-200">
              <AvatarFallback>
                {(currentUser.name || currentUser.username || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Link
            to="/auth"
            className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
