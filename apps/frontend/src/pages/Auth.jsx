import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin, useRegister } from '@/hooks/useApi';
import useAuthStore from '@/stores/authStore';
import { useForm } from '@tanstack/react-form';
import { AnimatePresence, m } from 'framer-motion';
import { Eye, EyeOff, Loader2, Store } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function Auth({ onLogin: onLoginProp }) {
  const [mode, setMode] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const login = useAuthStore((s) => s.login);

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const form = useForm({
    defaultValues: {
      name: '',
      username: '',
      password: '',
      role: 'Buyer',
    },
    onSubmit: async ({ value }) => {
      try {
        if (mode === 'login') {
          const res = await loginMutation.mutateAsync({
            username: value.username,
            password: value.password,
          });
          localStorage.setItem('token', res.data.token);
          const userData = { ...res.data.user };
          await login(userData);
          onLoginProp?.(userData);
        } else {
          if (!value.name.trim()) return;
          const res = await registerMutation.mutateAsync({
            name: value.name,
            username: value.username,
            password: value.password,
            role: value.role,
          });
          localStorage.setItem('token', res.data.token);
          const regUser = {
            id: res.data.user.id,
            username: res.data.user.username,
            role: res.data.user.role,
            name: res.data.user.name || res.data.user.username,
            balance: 0,
          };
          await login(regUser);
          onLoginProp?.(regUser);
        }
      } catch (err) {
        console.log('error', err);
      }
    },
  });

  const loading = loginMutation.isPending || registerMutation.isPending;

  const switchMode = useCallback(
    (m) => {
      setMode(m);
      form.reset();
    },
    [form],
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[rgba(99,102,241,0.06)] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[rgba(139,92,246,0.05)] blur-3xl" />
      </div>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-105 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-glow border border-border-hover mb-4 shadow-[0_0_24px_rgba(99,102,241,0.25)]">
            <Store size={24} className="text-(--color-primary)" />
          </div>
          <h1
            className="gradient-text text-3xl font-bold mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Shoppershala
          </h1>
          <p className="text-sm text-(--color-muted-foreground)">
            {mode === 'login'
              ? 'Welcome back. Sign in to continue.'
              : 'Create your account to get started.'}
          </p>
        </div>

        <Card className="glass-heavy border-[rgba(255,255,255,0.08)]">
          <div className="flex border-b border-border">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                type="button"
                className={`flex-1 py-3.5 text-sm font-semibold capitalize transition-all duration-200 ${
                  mode === m
                    ? 'text-(--color-foreground) border-b-2 border-(--color-primary)'
                    : 'text-(--color-muted-foreground) hover:text-(--color-foreground)'
                }`}
                onClick={() => switchMode(m)}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <m.form
                key={mode}
                initial={{ opacity: 0, x: mode === 'login' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-4"
              >
                {mode === 'register' && (
                  <form.Field name="name">
                    {(field) => (
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </form.Field>
                )}

                <form.Field name="username">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="your_username"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                        autoComplete="username"
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPass ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                          className="pr-10"
                          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted-foreground) hover:text-(--color-foreground) transition-colors"
                          onClick={() => setShowPass((v) => !v)}
                        >
                          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}
                </form.Field>

                {mode === 'register' && (
                  <form.Field name="email">
                    {(field) => (
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john.doe@example.com"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </form.Field>
                )}
                {mode === 'register' && (
                  <form.Field name="phone">
                    {(field) => (
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="number"
                          placeholder="123-456-7890"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </form.Field>
                )}

                {mode === 'register' && (
                  <form.Field name="role">
                    {(field) => (
                      <div className="space-y-1.5">
                        <Label htmlFor="role">Account Role</Label>
                        <select
                          id="role"
                          name="role"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="input-base h-10 px-3"
                        >
                          <option value="buyer">Buyer</option>
                          <option value="seller">Seller</option>
                        </select>
                      </div>
                    )}
                  </form.Field>
                )}

                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Processing…
                    </>
                  ) : mode === 'login' ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </m.form>
            </AnimatePresence>

            <div className="mt-5 p-3 rounded-xl bg-[rgba(99,102,241,0.07)] border border-[rgba(99,102,241,0.15)]">
              <p className="text-[11px] font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-2">
                Demo Credentials
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'admin', user: 'admin', pass: 'admin123' },
                  { role: 'seller', user: 'seller', pass: 'seller123' },
                  { role: 'buyer', user: 'buyer', pass: 'buyer123' },
                ].map(({ role, user, pass }) => (
                  <button
                    key={role}
                    type="button"
                    className="text-left p-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-border hover:border-border-hover transition-colors"
                    onClick={() => {
                      setMode('login');
                      form.setFieldValue('username', user);
                      form.setFieldValue('password', pass);
                    }}
                  >
                    <p className="text-[10px] font-bold text-(--color-primary) capitalize mb-0.5">
                      {role}
                    </p>
                    <p className="text-[10px] text-(--color-muted-foreground) font-mono">{user}</p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </m.div>
    </div>
  );
}
