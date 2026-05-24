'use server'

import { createClient } from '@/lib/supabase/server'
import type {
  Profile,
  StudentProfile,
  StaffProfile,
  Application,
  University,
  Document,
  Consultation,
  Ticket,
  Payment,
  Notification,
  Lead,
  Message,
} from '@/types/database'

// ============================================
// AUTH ACTIONS
// ============================================

export async function getCurrentUser(): Promise<Profile | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return profile || null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function checkUserRole(requiredRoles: string[]): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false
    return requiredRoles.includes(user.role)
  } catch (error) {
    console.error('Error checking user role:', error)
    return false
  }
}

// ============================================
// PROFILE ACTIONS
// ============================================

export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    return data || null
  } catch (error) {
    console.error('Error getting student profile:', error)
    return null
  }
}

export async function getStaffProfile(userId: string): Promise<StaffProfile | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('staff_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    return data || null
  } catch (error) {
    console.error('Error getting staff profile:', error)
    return null
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    return data || null
  } catch (error) {
    console.error('Error updating profile:', error)
    return null
  }
}

// ============================================
// APPLICATIONS ACTIONS
// ============================================

export async function getStudentApplications(userId: string): Promise<Application[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('applications')
      .select('*, university:universities(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error getting student applications:', error)
    return []
  }
}

export async function getApplicationById(applicationId: string): Promise<Application | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('applications')
      .select('*, university:universities(*), counselor:profiles(*)')
      .eq('id', applicationId)
      .single()

    return data || null
  } catch (error) {
    console.error('Error getting application:', error)
    return null
  }
}

export async function createApplication(
  userId: string,
  universityId: string,
  programName: string
): Promise<Application | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('applications')
      .insert([
        {
          user_id: userId,
          university_id: universityId,
          program_name: programName,
          status: 'draft',
        },
      ])
      .select('*, university:universities(*)')
      .single()

    return data || null
  } catch (error) {
    console.error('Error creating application:', error)
    return null
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string
): Promise<Application | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select('*, university:universities(*)')
      .single()

    return data || null
  } catch (error) {
    console.error('Error updating application status:', error)
    return null
  }
}

// ============================================
// UNIVERSITIES ACTIONS
// ============================================

export async function getAllUniversities(): Promise<University[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('universities')
      .select('*')
      .eq('is_active', true)
      .order('featured', { ascending: false })
      .order('ranking', { ascending: true })

    return data || []
  } catch (error) {
    console.error('Error getting universities:', error)
    return []
  }
}

export async function getUniversityById(universityId: string): Promise<University | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('universities')
      .select('*')
      .eq('id', universityId)
      .single()

    return data || null
  } catch (error) {
    console.error('Error getting university:', error)
    return null
  }
}

// ============================================
// DOCUMENTS ACTIONS
// ============================================

export async function getUserDocuments(userId: string): Promise<any[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error getting user documents:', error)
    return []
  }
}

export async function uploadDocument(
  userId: string,
  documentType: string,
  fileUrl: string,
  fileName: string,
  fileSize: number,
  mimeType: string
): Promise<any | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('documents')
      .insert([
        {
          user_id: userId,
          type: documentType,
          file_url: fileUrl,
          name: fileName,
          file_size: fileSize,
          mime_type: mimeType,
          verified: false,
        },
      ])
      .select()
      .single()

    return data || null
  } catch (error) {
    console.error('Error uploading document:', error)
    return null
  }
}

// ============================================
// CONSULTATIONS ACTIONS
// ============================================

export async function getUserConsultations(userId: string): Promise<Consultation[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('consultations')
      .select('*, student:profiles!student_id(*), staff:profiles!staff_id(*)')
      .or(`student_id.eq.${userId},staff_id.eq.${userId}`)
      .eq('is_active', true)
      .order('scheduled_at', { ascending: true })

    return data || []
  } catch (error) {
    console.error('Error getting consultations:', error)
    return []
  }
}

export async function bookConsultation(
  studentId: string,
  staffId: string,
  title: string,
  scheduledAt: string,
  durationMinutes: number = 30
): Promise<Consultation | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('consultations')
      .insert([
        {
          student_id: studentId,
          staff_id: staffId,
          title,
          scheduled_at: scheduledAt,
          duration_minutes: durationMinutes,
          status: 'scheduled',
        },
      ])
      .select('*, student:profiles!student_id(*), staff:profiles!staff_id(*)')
      .single()

    return data || null
  } catch (error) {
    console.error('Error booking consultation:', error)
    return null
  }
}

// ============================================
// TICKETS ACTIONS
// ============================================

export async function getUserTickets(userId: string): Promise<Ticket[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error getting tickets:', error)
    return []
  }
}

export async function createTicket(
  userId: string,
  subject: string,
  description: string,
  category?: string
): Promise<Ticket | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('support_tickets')
      .insert([
        {
          user_id: userId,
          subject,
          description,
          category,
          status: 'open',
        },
      ])
      .select()
      .single()

    return data || null
  } catch (error) {
    console.error('Error creating ticket:', error)
    return null
  }
}

// ============================================
// NOTIFICATIONS ACTIONS
// ============================================

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    return data || []
  } catch (error) {
    console.error('Error getting notifications:', error)
    return []
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    return true
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return false
  }
}

// ============================================
// LEADS ACTIONS
// ============================================

export async function getAllLeads(): Promise<Lead[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error getting leads:', error)
    return []
  }
}

export async function createLead(
  name: string,
  email: string,
  phone?: string,
  country?: string,
  source?: string
): Promise<Lead | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('leads')
      .insert([
        {
          name,
          email,
          phone,
          country,
          source,
          status: 'new',
        },
      ])
      .select()
      .single()

    return data || null
  } catch (error) {
    console.error('Error creating lead:', error)
    return null
  }
}

// ============================================
// PAYMENTS ACTIONS
// ============================================

export async function getUserPayments(userId: string): Promise<Payment[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error getting payments:', error)
    return []
  }
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats(userId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const supabase = await createClient()

    const stats: Record<string, any> = {}

    if (user.role === 'student') {
      const applications = await getStudentApplications(userId)
      const documents = await getUserDocuments(userId)
      const consultations = await getUserConsultations(userId)
      const notifications = await getUserNotifications(userId)

      stats.totalApplications = applications.length
      stats.acceptedApplications = applications.filter(
        (a) => a.status === 'accepted'
      ).length
      stats.pendingApplications = applications.filter(
        (a) => a.status === 'draft' || a.status === 'submitted'
      ).length
      stats.totalDocuments = documents.length
      stats.verifiedDocuments = documents.filter((d) => d.status === 'verified').length
      stats.upcomingConsultations = consultations.filter(
        (c) => c.status === 'scheduled'
      ).length
      stats.unreadNotifications = notifications.filter((n) => !n.is_read).length
    }

    if (user.role === 'staff') {
      const { count: assignedStudents } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .eq('counselor_id', userId)

      const { count: pendingApplications } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .eq('counselor_id', userId)
        .eq('status', 'under_review')

      const consultations = await getUserConsultations(userId)

      stats.assignedStudents = assignedStudents || 0
      stats.pendingApplications = pendingApplications || 0
      stats.upcomingConsultations = consultations.filter(
        (c) => c.status === 'scheduled'
      ).length
    }

    if (user.role === 'admin' || user.role === 'super_admin') {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })

      const { count: totalApplications } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })

      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })

      stats.totalUsers = totalUsers || 0
      stats.totalApplications = totalApplications || 0
      stats.totalLeads = totalLeads || 0
    }

    return stats
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    return null
  }
}
