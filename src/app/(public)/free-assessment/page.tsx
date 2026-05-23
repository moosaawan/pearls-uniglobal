'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { COUNTRIES, DEGREE_LEVELS, IELTS_STATUS, BUDGET_RANGES, INTAKE_OPTIONS, QUALIFICATIONS } from '@/lib/constants'
import { ArrowLeft, ArrowRight, CheckCircle, ClipboardCheck, User, GraduationCap, Settings, Lock, Eye, EyeOff, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const assessmentSignupSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  whatsapp: z.string().optional(),
  email: z.string().email('Valid email is required'),
  preferredCountry: z.string().min(1, 'Please select a country'),
  desiredDegree: z.string().min(1, 'Please select a degree level'),
  lastQualification: z.string().min(1, 'Please select your qualification'),
  ieltsStatus: z.string().min(1, 'Please select your IELTS status'),
  budgetRange: z.string().min(1, 'Please select a budget range'),
  preferredIntake: z.string().min(1, 'Please select an intake'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      'Password must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character (!@#$%^&*)'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type AssessmentSignupFormData = z.infer<typeof assessmentSignupSchema>

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Education', icon: GraduationCap },
  { id: 3, title: 'Preferences', icon: Settings },
  { id: 4, title: 'Review', icon: CheckCircle },
  { id: 5, title: 'Create Account', icon: Lock },
]

export default function FreeAssessmentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, handleSubmit, control, formState: { errors }, watch, trigger } = useForm<AssessmentSignupFormData>({
    resolver: zodResolver(assessmentSignupSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      phone: '',
      whatsapp: '',
      email: '',
      preferredCountry: '',
      desiredDegree: '',
      lastQualification: '',
      ieltsStatus: '',
      budgetRange: '',
      preferredIntake: '',
      password: '',
      confirmPassword: '',
    }
  })

  const formData = watch()
  const progress = (currentStep / steps.length) * 100

  const nextStep = async () => {
    const fieldsToValidate: Record<number, (keyof AssessmentSignupFormData)[]> = {
      1: ['fullName', 'phone', 'email'],
      2: ['lastQualification'],
      3: ['preferredCountry', 'desiredDegree', 'ieltsStatus', 'budgetRange', 'preferredIntake'],
      4: [],
    }

    const valid = await trigger(fieldsToValidate[currentStep] || [])
    if (valid) setCurrentStep((s) => Math.min(s + 1, 5))
  }

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const onSubmit = async (data: AssessmentSignupFormData) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      // Sign up student
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: 'student',
            last_qualification: data.lastQualification,
            preferred_country: data.preferredCountry,
            desired_degree: data.desiredDegree,
            ielts_status: data.ieltsStatus,
            budget_range: data.budgetRange,
            preferred_intake: data.preferredIntake
          }
        }
      })

      if (signUpError) {
        toast.error(signUpError.message)
        setIsLoading(false)
        return
      }

      setSubmitted(true)
      toast.success('Assessment submitted and account created successfully!')
      
      // Auto sign-in if possible, otherwise we let the user know they need to verify
      if (authData.session) {
        router.push('/student')
      }
    } catch (err) {
      toast.error('An error occurred during submission. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center section-padding">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3 font-sans">Assessment Submitted!</h1>
          <p className="text-muted-foreground mb-4 font-sans">
            Thank you! Your assessment has been submitted.
          </p>
          <p className="text-muted-foreground mb-8 font-sans text-sm">
            We have sent a verification email to <strong>{formData.email}</strong>. Please verify your email to log in and access your student dashboard.
          </p>
          <Button asChild className="bg-gold hover:bg-gold-dark text-navy rounded-xl h-11 px-8 font-sans">
            <a href="/login">Go to Login</a>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero text-white py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.08),transparent_60%)]" />
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="container-wide relative z-10 text-center">
          <motion.div variants={fadeUp}>
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-4 font-sans"><ClipboardCheck className="w-3 h-3 mr-1" /> Free Assessment</Badge>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            Get Your <span className="text-gradient">Free Profile</span> Assessment
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/70 max-w-xl mx-auto font-sans">
            Fill out this form, create your account, and our experts will evaluate your profile for UK university admission.
          </motion.p>
        </motion.div>
      </section>

      <section className="section-padding -mt-8">
        <div className="container-wide max-w-2xl">
          {/* Step Indicators */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-sans transition-all duration-300 ${
                    currentStep >= step.id ? 'bg-gold text-navy shadow-gold' : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                  </div>
                  <span className="hidden md:block text-xs font-medium text-foreground font-sans">{step.title}</span>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Form Card */}
          <Card className="border-border/50 shadow-premium">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal */}
                  {currentStep === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <h2 className="text-xl font-bold text-foreground mb-1 font-sans">Personal Information</h2>
                      <p className="text-muted-foreground text-sm mb-6 font-sans">Tell us about yourself</p>
                      <div>
                        <Label className="font-sans">Full Name *</Label>
                        <Input {...register('fullName')} placeholder="Your full name" className="mt-1.5 h-11 rounded-xl font-sans" />
                        {errors.fullName && <p className="text-destructive text-xs mt-1 font-sans">{errors.fullName.message}</p>}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-sans">Phone Number *</Label>
                          <Input {...register('phone')} placeholder="+92 300 000 0000" className="mt-1.5 h-11 rounded-xl font-sans" />
                          {errors.phone && <p className="text-destructive text-xs mt-1 font-sans">{errors.phone.message}</p>}
                        </div>
                        <div>
                          <Label className="font-sans">WhatsApp</Label>
                          <Input {...register('whatsapp')} placeholder="WhatsApp number" className="mt-1.5 h-11 rounded-xl font-sans" />
                        </div>
                      </div>
                      <div>
                        <Label className="font-sans">Email *</Label>
                        <Input type="email" {...register('email')} placeholder="your@email.com" className="mt-1.5 h-11 rounded-xl font-sans" />
                        {errors.email && <p className="text-destructive text-xs mt-1 font-sans">{errors.email.message}</p>}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Education */}
                  {currentStep === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <h2 className="text-xl font-bold text-foreground mb-1 font-sans">Education Background</h2>
                      <p className="text-muted-foreground text-sm mb-6 font-sans">Tell us about your academic background</p>
                      <div>
                        <Label className="font-sans">Last Qualification *</Label>
                        <Controller name="lastQualification" control={control} render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="mt-1.5 h-11 rounded-xl font-sans"><SelectValue placeholder="Select qualification" /></SelectTrigger>
                            <SelectContent>{QUALIFICATIONS.map((q) => (<SelectItem key={q} value={q} className="font-sans">{q}</SelectItem>))}</SelectContent>
                          </Select>
                        )} />
                        {errors.lastQualification && <p className="text-destructive text-xs mt-1 font-sans">{errors.lastQualification.message}</p>}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Preferences */}
                  {currentStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <h2 className="text-xl font-bold text-foreground mb-1 font-sans">Study Preferences</h2>
                      <p className="text-muted-foreground text-sm mb-6 font-sans">What are you looking for?</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-sans">Preferred Country *</Label>
                          <Controller name="preferredCountry" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="mt-1.5 h-11 rounded-xl font-sans"><SelectValue placeholder="Select country" /></SelectTrigger>
                              <SelectContent>{COUNTRIES.map((c) => (<SelectItem key={c} value={c} className="font-sans">{c}</SelectItem>))}</SelectContent>
                            </Select>
                          )} />
                        </div>
                        <div>
                          <Label className="font-sans">Desired Degree *</Label>
                          <Controller name="desiredDegree" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="mt-1.5 h-11 rounded-xl font-sans"><SelectValue placeholder="Select degree" /></SelectTrigger>
                              <SelectContent>{DEGREE_LEVELS.map((d) => (<SelectItem key={d} value={d} className="font-sans">{d}</SelectItem>))}</SelectContent>
                            </Select>
                          )} />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-sans">IELTS Status *</Label>
                          <Controller name="ieltsStatus" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="mt-1.5 h-11 rounded-xl font-sans"><SelectValue placeholder="Select status" /></SelectTrigger>
                              <SelectContent>{IELTS_STATUS.map((s) => (<SelectItem key={s} value={s} className="font-sans">{s}</SelectItem>))}</SelectContent>
                            </Select>
                          )} />
                        </div>
                        <div>
                          <Label className="font-sans">Budget Range *</Label>
                          <Controller name="budgetRange" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="mt-1.5 h-11 rounded-xl font-sans"><SelectValue placeholder="Select budget" /></SelectTrigger>
                              <SelectContent>{BUDGET_RANGES.map((b) => (<SelectItem key={b} value={b} className="font-sans">{b}</SelectItem>))}</SelectContent>
                            </Select>
                          )} />
                        </div>
                      </div>
                      <div>
                        <Label className="font-sans">Preferred Intake *</Label>
                        <Controller name="preferredIntake" control={control} render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="mt-1.5 h-11 rounded-xl font-sans"><SelectValue placeholder="Select intake" /></SelectTrigger>
                            <SelectContent>{INTAKE_OPTIONS.map((i) => (<SelectItem key={i} value={i} className="font-sans">{i}</SelectItem>))}</SelectContent>
                          </Select>
                        )} />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Review */}
                  {currentStep === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <h2 className="text-xl font-bold text-foreground mb-1 font-sans">Review Your Information</h2>
                      <p className="text-muted-foreground text-sm mb-6 font-sans">Please review before proceeding to account creation</p>
                      <div className="space-y-3 bg-muted/50 rounded-xl p-5">
                        {[
                          ['Name', formData.fullName],
                          ['Phone', formData.phone],
                          ['Email', formData.email],
                          ['Qualification', formData.lastQualification],
                          ['Country', formData.preferredCountry],
                          ['Degree', formData.desiredDegree],
                          ['IELTS', formData.ieltsStatus],
                          ['Budget', formData.budgetRange],
                          ['Intake', formData.preferredIntake],
                        ].map(([label, value]) => (
                          <div key={label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                            <span className="text-muted-foreground text-sm font-sans">{label}</span>
                            <span className="text-foreground font-medium text-sm font-sans">{value || '—'}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Sign Up */}
                  {currentStep === 5 && (
                    <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <h2 className="text-xl font-bold text-foreground mb-1 font-sans">Create Your Account</h2>
                      <p className="text-muted-foreground text-sm mb-6 font-sans">Create a password to access your application portal</p>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            className="mt-1.5 h-11 rounded-xl font-sans pr-10"
                            {...register('password')}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-destructive text-xs mt-1 font-sans">{errors.password.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            className="mt-1.5 h-11 rounded-xl font-sans pr-10"
                            {...register('confirmPassword')}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-destructive text-xs mt-1 font-sans">{errors.confirmPassword.message}</p>}
                      </div>

                      <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 space-y-2 text-xs text-muted-foreground">
                        <p className="font-semibold text-foreground">Password must contain:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>At least 8 characters</li>
                          <li>At least 1 uppercase letter</li>
                          <li>At least 1 lowercase letter</li>
                          <li>At least 1 number</li>
                          <li>At least 1 special character (!@#$%^&*)</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1 || isLoading} className="rounded-xl font-sans">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  {currentStep < 5 ? (
                    <Button type="button" onClick={nextStep} className="bg-gold hover:bg-gold-dark text-navy rounded-xl font-sans">
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading} className="bg-gold hover:bg-gold-dark text-navy rounded-xl font-semibold font-sans">
                      {isLoading ? (
                        <>Creating Account...</>
                      ) : (
                        <>Submit Assessment & Sign Up <CheckCircle className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
