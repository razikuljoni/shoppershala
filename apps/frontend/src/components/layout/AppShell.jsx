import useAuthStore from '@/stores/authStore';
import useCartStore from '@/stores/cartStore';
import useUIStore from '@/stores/uiStore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppShell({ children }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const cartItemCount = useCartStore((s) =>
    Object.values(s.cart).reduce((sum, i) => sum + i.quantity, 0),
  );

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar
        currentUser={currentUser}
        cartItemCount={cartItemCount}
        onLogout={logout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px]">
        <Navbar currentUser={currentUser} onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-6 py-6 max-w-screen-2xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
