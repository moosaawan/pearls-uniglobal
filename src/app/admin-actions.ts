'use server'

import { createClient } from '@/lib/supabase/server'
import type {
  Application,
  User,
  Profile,
  Document,
  Consultation,
  Ticket,
  Lead,
  Payment,
} from '@/types/database'

// ============================================
// STAFF ACTIONS
// ============================================

export async function getStaffAssignedStudents(staffId: string): Promise<Profile[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error getting assigned students:', error)
    return []
  }
}

export async function getStaffApplications(staffId: string): Promise<Application[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('applications')
      .select('*, university:universities(*), user:profiles!user_id(*)')
      .eq('counselor_id', staffId)
      .order('created_at', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error getting staff applications:', error)
    return []
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string,
  notes?: string
): Promise<Application | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('applications')
      .update({
        status,
        counselor_notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select('*, university:universities(*)')
      .single()

    return data || null
  } catch (error) {
    console.error('Error updating application status:', error)
    return null
  }
}

export async function getPendingDocuments(staffId?: string): Promise<any[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('documents')
      .select('*, user:profiles(*)')
      .eq('verified', false)
      .order('created_at', { ascending: true })

    return data || []
  } catch (error) {
    console.error('Error getting pending documents:', error)
    return []
  }
}

export async function verifyDocument(
  documentId: string,
  status: 'verified' | 'rejected',
  reason?: string
): Promise<any | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('documents')
      .update({
        verified: status === 'verified',
        verified_by: status === 'verified' ? user?.id : null,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId)
      .select()
      .single()

    return data || null
  } catch (error) {
    console.error('Error verifying document:', error)
    return null
  }
}

export async function getStaffConsultations(staffId: string): Promise<Consultation[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('consultations')
      .select('*, student:profiles!student_id(*), staff:profiles!staff_id(*)')
      .eq('staff_id', staffId)
      .order('scheduled_at', { ascending: true })

    return data || []
  } catch (error) {
    console.error('Error getting staff consultations:', error)
    return []
  }
}

// ============================================
// ADMIN ACTIONS
// ============================================

export async function getAllProfiles(role?: string): Promise<Profile[]> {
  try {
    const supabase = await createClient()
    let query = supabase.from('profiles').select('*')

    if (role) {
      query = query.eq('role', role)
    }

    const { data } = await query.order('created_at', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error getting profiles:', error)
    return []
  }
}

export async function getProfileById(userId: string): Promise<Profile | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    return data || null
  } catch (error) {
    console.error('Error getting profile:', error)
    return null
  }
}

export async function updateProfileRole(
  userId: string,
  newRole: string
): Promise<Profile | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    return data || null
  } catch (error) {
    console.error('Error updating profile role:', error)
    return null
  }
}

export async function suspendProfile(
  userId: string,
  suspend: boolean
): Promise<Profile | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('profiles')
      .update({
        is_active: !suspend,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    return data || null
  } catch (error) {
    console.error('Error suspending profile:', error)
    return null
  }
}

export async function getAllApplications(): Promise<Application[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('applications')
      .select('*, university:universities(*), user:profiles!user_id(*)')
      .order('created_at', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error getting all applications:', error)
    return []
  }
}

export async function getAllLeads(): Promise<Lead[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('leads')
      .select('*, assigned_user:profiles(*)')
      .order('created_at', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error getting all leads:', error)
    return []
  }
}

export async function assignLeadToStaff(
  leadId: string,
  staffId: string
): Promise<Lead | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('leads')
      .update({
        assigned_to: staffId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId)
      .select()
      .single()

    return data || null
  } catch (error) {
    console.error('Error assigning lead:', error)
    return null
  }
}

export async function updateLeadStatus(
  leadId: string,
  status: string
): Promise<Lead | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('leads')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId)
      .select()
      .single()

    return data || null
  } catch (error) {
    console.error('Error updating lead status:', error)
    return null
  }
}

export async function getSystemStats() {
  try {
    const supabase = await createClient()

    const [
      { count: totalUsers },
      { count: totalApplications },
      { count: totalPayments },
      { count: totalLeads },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('payments').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true }),
    ])

    const students = await getAllProfiles('student')
    const staff = await getAllProfiles('staff')

    return {
      totalUsers: totalUsers || 0,
      totalStudents: students.length,
      totalStaff: staff.length,
      totalApplications: totalApplications || 0,
      totalPayments: totalPayments || 0,
      totalLeads: totalLeads || 0,
    }
  } catch (error) {
    console.error('Error getting system stats:', error)
    return null
  }
}

export async function getAllConsultations(): Promise<Consultation[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('consultations')
      .select('*, student:profiles!student_id(*), staff:profiles!staff_id(*)')
      .order('scheduled_at', { ascending: true })

    return data || []
  } catch (error) {
    console.error('Error getting all consultations:', error)
    return []
  }
}

export async function getAllPayments(): Promise<Payment[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('payments')
      .select('*, user:profiles(*)')
      .order('created_at', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error getting all payments:', error)
    return []
  }
}

export async function getRevenueStats() {
  try {
    const supabase = await createClient()
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, currency, status, created_at')
      .eq('status', 'completed')

    if (!payments || payments.length === 0) {
      return {
        totalRevenue: 0,
        totalTransactions: 0,
        averageTransaction: 0,
        currency: 'PKR',
      }
    }

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)

    return {
      totalRevenue,
      totalTransactions: payments.length,
      averageTransaction: totalRevenue / payments.length,
      currency: 'PKR',
    }
  } catch (error) {
    console.error('Error getting revenue stats:', error)
    return null
  }
}

// ============================================
// COMMON ADMIN ACTIONS
// ============================================

export async function getAllTickets(): Promise<Ticket[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('support_tickets')
      .select('*, user:profiles!user_id(*), assigned_user:profiles!assigned_to(*)')
      .order('created_at', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error getting all tickets:', error)
    return []
  }
}

export async function updateTicketStatus(
  ticketId: string,
  status: string
): Promise<Ticket | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('support_tickets')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId)
      .select()
      .single()

    return data || null
  } catch (error) {
    console.error('Error updating ticket status:', error)
    return null
  }
}

export async function assignTicketToStaff(
  ticketId: string,
  staffId: string
): Promise<Ticket | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('support_tickets')
      .update({
        assigned_to: staffId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId)
      .select()
      .single()

    return data || null
  } catch (error) {
    console.error('Error assigning ticket:', error)
    return null
  }
}
