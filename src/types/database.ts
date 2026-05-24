// ============================================
// ENUMS & TYPES
// ============================================

export type UserRole = 'student' | 'staff' | 'admin' | 'super_admin'
export type AccountStatus = 'pending' | 'approved' | 'rejected'
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
export type DocumentStatus = 'pending' | 'verified' | 'rejected' | 'needs_reupload'
export type ConsultationStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

// ============================================
// USER & PROFILE
// ============================================

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  whatsapp: string | null
  avatar_url: string | null
  role: UserRole
  account_status: AccountStatus
  email_verified: boolean
  last_name_change: string | null
  is_active: boolean
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
  profile?: Profile
}

export interface StaffProfile {
  id: string
  user_id: string
  specialization: string | null
  bio: string | null
  assigned_students_count: number
  commission_rate: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  profile?: Profile
}

// ============================================
// UNIVERSITIES
// ============================================

export interface University {
  id: string
  name: string
  country: string
  city: string | null
  ranking: number | null
  logo_url: string | null
  website_url: string | null
  description: string | null
  programs: string[]
  tuition_range: string | null
  has_scholarships: boolean
  featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============================================
// APPLICATIONS
// ============================================

export interface Application {
  id: string
  user_id: string
  university_id: string
  program_name: string
  status: ApplicationStatus
  stage: string | null
  counselor_id: string | null
  counselor_notes: string | null
  submitted_at: string | null
  decided_at: string | null
  offer_letter_url: string | null
  cas_number: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  university?: University
  counselor?: Profile
}

// ============================================
// DOCUMENTS
// ============================================

export interface Document {
  id: string
  user_id: string
  document_type: DocumentType
  file_url: string
  file_name: string | null
  file_size: number | null
  mime_type: string | null
  status: DocumentStatus
  verified_by: string | null
  rejection_reason: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  profile?: Profile
  verified_by_user?: Profile
}

// ============================================
// CONSULTATIONS
// ============================================

export interface Consultation {
  id: string
  student_id: string
  staff_id: string
  title: string | null
  description: string | null
  scheduled_at: string
  duration_minutes: number
  status: ConsultationStatus
  meeting_url: string | null
  meeting_type: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  student?: Profile
  staff?: Profile
}

// ============================================
// TICKETS & SUPPORT
// ============================================

export interface Ticket {
  id: string
  user_id: string
  assigned_to: string | null
  subject: string
  description: string
  status: TicketStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  user?: Profile
  assigned_user?: Profile
}

export interface TicketReply {
  id: string
  ticket_id: string
  user_id: string
  message: string
  attachments: string[] | null
  is_internal: boolean
  created_at: string
  updated_at: string
  user?: Profile
  ticket?: Ticket
}

// ============================================
// MESSAGES & CONVERSATIONS
// ============================================

export interface Conversation {
  id: string
  participant_ids: string[]
  title: string | null
  is_group: boolean
  last_message_at: string | null
  created_at: string
  updated_at: string
  participants?: Profile[]
  last_message?: Message
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  attachments: string[] | null
  is_read: boolean
  created_at: string
  sender?: Profile
  conversation?: Conversation
}

// ============================================
// PAYMENTS & INVOICES
// ============================================

export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  description: string | null
  payment_method: string | null
  status: PaymentStatus
  transaction_id: string | null
  paid_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  user?: Profile
}

export interface Invoice {
  id: string
  user_id: string
  payment_id: string | null
  invoice_number: string
  amount: number
  description: string | null
  due_date: string | null
  issued_date: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  pdf_url: string | null
  created_at: string
  updated_at: string
  user?: Profile
  payment?: Payment
}

// ============================================
// NOTIFICATIONS
// ============================================

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string | null
  related_to: string | null
  related_id: string | null
  is_read: boolean
  action_url: string | null
  created_at: string
  user?: Profile
}

// ============================================
// ACTIVITY LOGS
// ============================================

export interface ActivityLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  changes: Record<string, any> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
  user?: Profile
}

// ============================================
// LEADS & CRM
// ============================================

export interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  country: string | null
  desired_degree: string | null
  source: string | null
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  assigned_to: string | null
  notes: string | null
  created_at: string
  updated_at: string
  assigned_user?: Profile
}

// ============================================
// SETTINGS
// ============================================

export interface Settings {
  id: string
  key: string
  value: Record<string, any> | null
  description: string | null
  created_at: string
  updated_at: string
}
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
