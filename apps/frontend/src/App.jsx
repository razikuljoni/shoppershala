import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Navigate, Route, HashRouter as Router, Routes, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

import AiCopilot from '@/components/AiCopilot';
import AppShell from '@/components/layout/AppShell';
import { Skeleton } from '@/components/ui/skeleton';
import { useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useApi';
import { api } from '@/utils/api';

import Auth from '@/pages/Auth';
import Cart from '@/pages/Cart';
import Catalog from '@/pages/Catalog';
import Checkout from '@/pages/Checkout';
import Dashboard from '@/pages/Dashboard';
import ProductDetails from '@/pages/ProductDetails';
import Profile from '@/pages/Profile';

/* ---------------------------------------------------------------
   Page transition wrapper
   --------------------------------------------------------------- */
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

function PageTransition({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------
   Route Guards
   --------------------------------------------------------------- */
function RequireAuth({ currentUser, children }) {
  if (!currentUser) return <Navigate to="/auth" replace />;
  return children;
}

function RequireSeller({ currentUser, children }) {
  if (!currentUser) return <Navigate to="/auth" replace />;
  if (!['seller', 'admin'].includes(currentUser.role)) return <Navigate to="/" replace />;
  return children;
}

/* ---------------------------------------------------------------
   Full-screen boot loader
   --------------------------------------------------------------- */
function BootLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--color-background)]">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <div className="absolute inset-0 rounded-2xl border-2 border-[var(--color-primary)] animate-spin border-t-transparent" />
        </div>
        <div className="text-center space-y-1.5">
          <h2
            className="gradient-text text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Shoppershala
          </h2>
          <p className="text-sm text-[var(--color-muted-foreground)]">Syncing secure session…</p>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Main App Content
   --------------------------------------------------------------- */
function AppContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  /* Close sidebar on route change */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarOpen(false);
  }, [location]);

  /* Boot: check existing session */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    checkAuthToken();
  }, []);

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthLoading(false);
      return;
    }
    try {
      const res = await api.auth.whoami();
      const base = {
        id: res.data.id,
        username: res.data.username,
        role: res.data.role,
        balance: 0,
      };
      setCurrentUser(base);
      const [userRes, wishRes] = await Promise.all([
        api.users.getById(res.data.id),
        api.wishlist.get(),
      ]);
      setCurrentUser((prev) => ({
        ...prev,
        name: userRes.data.name,
        balance: userRes.data.balance || 0,
      }));
      if (wishRes.data?.products) setWishlist(wishRes.data.products.map((p) => p._id));
    } catch {
      localStorage.removeItem('token');
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (user) => {
    setCurrentUser(user);
    try {
      const [userRes, wishRes] = await Promise.all([
        api.users.getById(user.id),
        api.wishlist.get(),
      ]);
      setCurrentUser((prev) => ({
        ...prev,
        name: userRes.data.name,
        balance: userRes.data.balance || 0,
      }));
      if (wishRes.data?.products) setWishlist(wishRes.data.products.map((p) => p._id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setWishlist([]);
    setCart({});
    toast.info('Logged out successfully');
  };

  const handleUserUpdate = (updatedUser) => setCurrentUser(updatedUser);

  /* Wishlist */
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const toggleWishlist = async (productId) => {
    if (!currentUser) {
      toast.warning('Please sign in to manage your wishlist');
      return;
    }
    const inWishlist = wishlist.includes(productId);
    try {
      if (inWishlist) {
        await removeFromWishlist.mutateAsync(productId);
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await addToWishlist.mutateAsync(productId);
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error('Wishlist toggle failed:', err);
    }
  };

  /* Cart */
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev[product._id];
      return {
        ...prev,
        [product._id]: { product, quantity: existing ? existing.quantity + 1 : 1 },
      };
    });
    toast.success(`${product.name} added to cart`);
  };
  const removeFromCart = (id) =>
    setCart((prev) => {
      const u = { ...prev };
      delete u[id];
      return u;
    });
  const updateCartQuantity = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], quantity: qty } } : prev));
  };
  const clearCart = () => setCart({});

  const cartItemCount = Object.values(cart).reduce((s, i) => s + i.quantity, 0);

  /* addToast shim — delegate to Sonner */
  const addToast = (msg, type = 'info') => {
    if (type === 'success') toast.success(msg);
    else if (type === 'error') toast.error(msg);
    else if (type === 'warning') toast.warning(msg);
    else toast.info(msg);
  };

  if (authLoading) return <BootLoader />;

  const isAuthPage = location.pathname === '/auth';

  /* Pages that require the app shell */
  const appContent = (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/auth"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Auth onLogin={handleLogin} addToast={addToast} />
            )
          }
        />

        <Route
          path="/"
          element={
            <RequireAuth currentUser={currentUser}>
              <PageTransition>
                <Catalog
                  cart={cart}
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  addToast={addToast}
                />
              </PageTransition>
            </RequireAuth>
          }
        />

        <Route
          path="/wishlist"
          element={
            <RequireAuth currentUser={currentUser}>
              <PageTransition>
                <Catalog
                  cart={cart}
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  addToast={addToast}
                  wishlistOnly
                />
              </PageTransition>
            </RequireAuth>
          }
        />

        <Route
          path="/product/:id"
          element={
            <RequireAuth currentUser={currentUser}>
              <PageTransition>
                <ProductDetails
                  currentUser={currentUser}
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  addToast={addToast}
                />
              </PageTransition>
            </RequireAuth>
          }
        />

        <Route
          path="/cart"
          element={
            <RequireAuth currentUser={currentUser}>
              <PageTransition>
                <Cart
                  cart={cart}
                  updateCartQuantity={updateCartQuantity}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                />
              </PageTransition>
            </RequireAuth>
          }
        />

        <Route
          path="/checkout"
          element={
            <RequireAuth currentUser={currentUser}>
              <PageTransition>
                <Checkout
                  currentUser={currentUser}
                  cart={cart}
                  clearCart={clearCart}
                  onUserUpdate={handleUserUpdate}
                  addToast={addToast}
                />
              </PageTransition>
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth currentUser={currentUser}>
              <PageTransition>
                <Profile
                  currentUser={currentUser}
                  onUserUpdate={handleUserUpdate}
                  addToast={addToast}
                />
              </PageTransition>
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireSeller currentUser={currentUser}>
              <PageTransition>
                <Dashboard currentUser={currentUser} addToast={addToast} />
              </PageTransition>
            </RequireSeller>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );

  return (
    <>
      {isAuthPage ? (
        /* Auth page — full screen, no shell */
        <div className="min-h-screen bg-[var(--color-background)]">{appContent}</div>
      ) : (
        <AppShell
          currentUser={currentUser}
          cartItemCount={cartItemCount}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onSidebarOpen={() => setSidebarOpen(true)}
          onSidebarClose={() => setSidebarOpen(false)}
        >
          {appContent}
        </AppShell>
      )}

      {/* AI Copilot — visible when logged in */}
      {currentUser && !isAuthPage && (
        <AiCopilot currentUser={currentUser} onUserUpdate={handleUserUpdate} addToast={addToast} />
      )}

      {/* Sonner Toast Provider */}
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{
          style: {
            background: 'rgba(12,17,29,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#f8fafc',
            backdropFilter: 'blur(20px)',
            fontFamily: 'var(--font-sans)',
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
