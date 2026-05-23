'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2, ChevronDown, KeyRound } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { createClient } from '@/lib/supabase/client'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { UserRole } from '@/types/database'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDemo, setShowDemo] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      // Fetch user profile for role-based redirect
      let redirectPath = '/student'
      if (authData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single()

        if (profile) {
          const role = profile.role as UserRole
          if (role === 'admin' || role === 'super_admin') {
            redirectPath = '/admin'
          } else if (role === 'staff') {
            redirectPath = '/staff'
          }
        }
      }

      toast.success('Welcome back!')
      router.push(redirectPath)
      router.refresh()
    } catch {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setValue('email', 'admin@pearlsuniglobal.uk')
    setValue('password', 'admin123456')
    // Small delay to let form values update, then submit
    setTimeout(() => {
      handleSubmit(onSubmit)()
    }, 100)
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="text-center space-y-2">
        {/* Mobile-only logo */}
        <div className="flex justify-center lg:hidden mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold">
            <img src='/logo/uniglobal.png' alt='Pearls UniGlobal Logo' className='w-12 h-12 object-contain' />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-border bg-card p-8 shadow-premium"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={cn(
                  'pl-10 h-12 rounded-xl',
                  errors.email && 'border-destructive focus-visible:ring-destructive'
                )}
                {...register('email')}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-gold hover:text-gold-dark transition-colors font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={cn(
                  'pl-10 pr-10 h-12 rounded-xl',
                  errors.password && 'border-destructive focus-visible:ring-destructive'
                )}
                {...register('password')}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-gradient-gold text-navy font-semibold text-base hover:opacity-90 transition-opacity shadow-gold"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </motion.div>

      {/* Register Link */}
      <motion.p
        variants={fadeUp}
        className="text-center text-sm text-muted-foreground"
      >
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-gold font-semibold hover:text-gold-dark transition-colors"
        >
          Register
        </Link>
      </motion.p>

      {/* Test Admin Login */}
      <motion.div variants={fadeUp}>
        <button
          type="button"
          onClick={() => setShowDemo(!showDemo)}
          className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors py-2"
        >
          <KeyRound className="w-3 h-3" />
          <span>Demo Access</span>
          <ChevronDown className={cn('w-3 h-3 transition-transform', showDemo && 'rotate-180')} />
        </button>
        <AnimatePresence>
          {showDemo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border border-dashed border-border/50 rounded-xl p-4 space-y-3 mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 bg-muted/50 px-2 py-0.5 rounded-full">
                    Demo Access
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground/60">
                    <span className="font-medium">Email:</span> admin@pearlsuniglobal.uk
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    <span className="font-medium">Password:</span> admin123456
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full h-9 rounded-lg text-xs font-medium border-dashed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Login as Test Admin'
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
