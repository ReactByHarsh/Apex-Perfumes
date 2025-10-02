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
import { signupSchema, type SignupForm } from '@/lib/schema';
import { useToast } from '@/hooks/useToast';

export function Signup() {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      setError('');
      const success = await signup(data);
      if (success) {
        showToast({
          title: 'Account created',
          description: 'Welcome to APEX! You are signed in.',
          variant: 'success'
        });
        router.push('/');
      } else {
        // If Supabase requires email verification, user may not be signed in
        setError('Please check your email to verify your account, then sign in.');
        showToast({
          title: 'Verify your email',
          description: 'We sent a verification link to your inbox.',
          variant: 'info'
        });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      showToast({
        title: 'Sign up failed',
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
            Create your account
          </h2>
          <p className="mt-2 text-primary-600 dark:text-neutral-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-accent-500 hover:text-accent-600 transition-colors">
              Sign in
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

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register('firstName')}
                error={errors.firstName?.message}
              />
              <Input
                label="Last Name"
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>

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
                autoComplete="new-password"
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

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-primary-400 hover:text-primary-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-primary-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agree" className="text-primary-700 dark:text-neutral-300">
                  I agree to the{' '}
                  <Link href="/terms" className="text-accent-500 hover:text-accent-600">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-accent-500 hover:text-accent-600">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}