import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name is too long'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        'Password must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character (!@#$%^&*)'
      ),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        'Password must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character (!@#$%^&*)'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
})

export const assessmentSchema = z.object({
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
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type AssessmentFormData = z.infer<typeof assessmentSchema>
export type ContactFormData = z.infer<typeof contactSchema>
