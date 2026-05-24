'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'number'
  placeholder?: string
  options?: { label: string; value: string }[]
  required?: boolean
  validation?: (value: any) => string | null
  hint?: string
}

interface DashboardFormProps {
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => Promise<void>
  submitLabel?: string
  cancelHref?: string
}

export default function DashboardForm({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  cancelHref,
}: DashboardFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    fields.forEach((field) => {
      const value = formData[field.name]

      // Check required
      if (field.required && !value) {
        newErrors[field.name] = `${field.label} is required`
        return
      }

      // Custom validation
      if (field.validation && value) {
        const error = field.validation(value)
        if (error) {
          newErrors[field.name] = error
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors below')
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(formData)
      toast.success('Submitted successfully!')
      setFormData(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
      )
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur"
    >
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label className="text-white font-medium">{field.label}</Label>

          {field.type === 'textarea' ? (
            <textarea
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-yellow-400/50 outline-none resize-none"
              rows={4}
            />
          ) : field.type === 'select' ? (
            <select
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-yellow-400/50 outline-none"
            >
              <option value="">Select an option</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-navy">
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <Input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="bg-white/5 border-white/10 text-white placeholder-white/50 focus:border-yellow-400/50"
            />
          )}

          {field.hint && (
            <p className="text-xs text-white/50">{field.hint}</p>
          )}

          {errors[field.name] && (
            <p className="text-xs text-red-400">{errors[field.name]}</p>
          )}
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-white/10">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-yellow to-orange text-black hover:shadow-lg hover:shadow-orange/50 transition-shadow gap-2"
        >
          {isLoading && <Loader2 size={18} className="animate-spin" />}
          {isLoading ? 'Loading...' : submitLabel}
        </Button>

        {cancelHref && (
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
        )}
      </div>
    </motion.form>
  )
}
