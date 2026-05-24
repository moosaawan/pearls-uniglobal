'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

  const [showDemo, setShowDemo] = useState(false)

  const handleQuickLogin = (emailVal: string, passVal: string) => {
    setValue('email', emailVal)
    setValue('password', passVal)
    
    // Defer form submission slightly to let setValue register
    setTimeout(() => {
      handleSubmit(onSubmit)()
    }, 150)
  }

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

      {/* Demo Credentials Panel */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-dashed border-gold/30 bg-gold/5 p-5 text-center font-sans"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Demo Portals Access
          </span>
          <Button
            variant="ghost"
            onClick={() => setShowDemo(!showDemo)}
            className="h-7 text-xs text-muted-foreground hover:text-gold hover:bg-white/5 px-2 rounded-lg"
          >
            {showDemo ? 'Hide Portals' : 'Select Portal'}
          </Button>
        </div>
        
        {showDemo && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-2 pt-2 text-left">
            <div className="p-3 rounded-xl bg-card border border-border/50 hover:border-gold/30 transition-all cursor-pointer flex justify-between items-center group"
              onClick={() => handleQuickLogin('moosa@gmail.com', '123456')}
            >
              <div>
                <p className="text-xs font-bold text-foreground group-hover:text-gold transition-colors">Super Admin Portal</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">moosa@gmail.com / 123456</p>
              </div>
              <Badge className="bg-red-500/10 text-red-500 border-none hover:bg-red-500/10 text-[9px] uppercase font-bold py-0.5">Super Admin</Badge>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/50 hover:border-gold/30 transition-all cursor-pointer flex justify-between items-center group"
              onClick={() => handleQuickLogin('sarah@pearlsuniglobal.uk', 'admin123456')}
            >
              <div>
                <p className="text-xs font-bold text-foreground group-hover:text-gold transition-colors">Counseling Staff Portal</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">sarah@pearlsuniglobal.uk / admin123456</p>
              </div>
              <Badge className="bg-yellow-500/10 text-yellow-600 border-none hover:bg-yellow-500/10 text-[9px] uppercase font-bold py-0.5">Staff Office</Badge>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/50 hover:border-gold/30 transition-all cursor-pointer flex justify-between items-center group"
              onClick={() => handleQuickLogin('student1@gmail.com', 'admin123456')}
            >
              <div>
                <p className="text-xs font-bold text-foreground group-hover:text-gold transition-colors">Student Portal</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">student1@gmail.com / admin123456</p>
              </div>
              <Badge className="bg-blue-500/10 text-blue-500 border-none hover:bg-blue-500/10 text-[9px] uppercase font-bold py-0.5">Client Student</Badge>
            </div>
          </motion.div>
        )}
      </motion.div>

    </motion.div>
  )
}
