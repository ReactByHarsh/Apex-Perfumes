"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginSchema, type LoginForm } from '@/lib/schema';
import { useToast } from '@/hooks/useToast';

export function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const success = await login(data.email, data.password);
      
      if (success) {
        showToast({
          title: 'Signed in',
          description: 'Welcome back to APEX!',
          variant: 'success'
        });
        router.push('/');
      } else {
        setError('Invalid email or password');
        showToast({
          title: 'Sign in failed',
          description: 'Invalid email or password',
          variant: 'error'
        });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      showToast({
        title: 'Sign in failed',
        description: err.message || 'Please try again later.',
        variant: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold tracking-widest text-primary-950 dark:text-neutral-100 hover:text-accent-500 transition-colors"
          >
            APEX
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-primary-950 dark:text-neutral-100">
            Sign in to your account
          </h2>
          <p className="mt-2 text-primary-600 dark:text-neutral-400">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-accent-500 hover:text-accent-600 transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        <div className="bg-white dark:bg-primary-900 py-8 px-6 shadow-lg rounded-lg border border-primary-200 dark:border-primary-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password')}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-primary-400 hover:text-primary-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-primary-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-primary-900 dark:text-neutral-100">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="text-accent-500 hover:text-accent-600 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Demo Account Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              <strong>Demo Account:</strong>
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Email: demo@apex.com<br />
              Password: password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}