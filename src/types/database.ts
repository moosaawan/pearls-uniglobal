// User & Auth Types
export type UserRole = 'student' | 'staff' | 'admin' | 'super_admin'

export interface Profile {
  id: string
  email: string
  full_name: string
  phone: string | null
  whatsapp: string | null
  avatar_url: string | null
  role: UserRole
  email_verified: boolean
  last_name_change: string | null
  created_at: string
  updated_at: string
}

export interface StudentProfile {
  id: string
  user_id: string
  date_of_birth: string | null
  nationality: string | null
  passport_number: string | null
  current_address: string | null
  city: string | null
  country: string | null
  last_qualification: string | null
  institution: string | null
  gpa: string | null
  ielts_score: string | null
  ielts_status: string | null
  preferred_country: string | null
  desired_degree: string | null
  budget_range: string | null
  preferred_intake: string | null
  profile_completion: number
  created_at: string
  updated_at: string
}

// Application Types
export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'visa_applied'
  | 'visa_approved'
  | 'visa_rejected'
  | 'enrolled'

export interface Application {
  id: string
  user_id: string
  university_id: string
  program_name: string
  status: ApplicationStatus
  stage: string
  counselor_notes: string | null
  submitted_at: string | null
  decided_at: string | null
  created_at: string
  updated_at: string
  university?: University
}

export interface University {
  id: string
  name: string
  country: string
  city: string
  ranking: number | null
  logo_url: string | null
  website_url: string | null
  description: string | null
  programs: string[]
  tuition_range: string | null
  has_scholarships: boolean
  featured: boolean
  created_at: string
  updated_at: string
}

// Document Types
export type DocumentType =
  | 'passport'
  | 'transcript'
  | 'degree'
  | 'ielts_result'
  | 'sop'
  | 'recommendation'
  | 'cv'
  | 'financial'
  | 'photo'
  | 'other'

export interface Document {
  id: string
  user_id: string
  application_id: string | null
  name: string
  type: DocumentType
  file_url: string
  file_size: number
  mime_type: string
  folder: string
  verified: boolean
  verified_by: string | null
  verified_at: string | null
  created_at: string
  updated_at: string
}

// Lead / CRM Types
export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'converted'
  | 'lost'

export interface Lead {
  id: string
  full_name: string
  email: string
  phone: string
  whatsapp: string | null
  source: string
  status: LeadStatus
  counselor_id: string | null
  preferred_country: string | null
  desired_degree: string | null
  last_qualification: string | null
  ielts_status: string | null
  budget_range: string | null
  preferred_intake: string | null
  notes: string | null
  converted_at: string | null
  created_at: string
  updated_at: string
  counselor?: Profile
}

// Appointment Types
export type AppointmentType =
  | 'consultation'
  | 'interview_prep'
  | 'document_review'
  | 'ielts_counseling'
  | 'visa_guidance'
  | 'follow_up'

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export interface Appointment {
  id: string
  user_id: string
  type: AppointmentType
  scheduled_at: string
  duration: number
  status: AppointmentStatus
  meeting_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// Blog Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  author: string
  category: string
  tags: string[]
  published: boolean
  seo_title: string | null
  seo_description: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

// Notification Types
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  read: boolean
  action_url: string | null
  created_at: string
}

// Activity Log Types
export interface ActivityLog {
  id: string
  user_id: string
  action: string
  details: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

// Support Ticket Types
export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  description: string
  status: TicketStatus
  priority: string
  assigned_to: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  success: boolean
}

// Dashboard Stats
export interface DashboardStats {
  totalApplications: number
  pendingApplications: number
  approvedVisas: number
  totalDocuments: number
  profileCompletion: number
  upcomingAppointments: number
}

// CRM Pipeline Column
export interface PipelineColumn {
  id: LeadStatus
  title: string
  leads: Lead[]
  color: string
}
