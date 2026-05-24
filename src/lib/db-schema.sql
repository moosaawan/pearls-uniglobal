-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO public;

-- ============================================
-- ROLES & PERMISSIONS TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  module VARCHAR(50),
  action VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- ============================================
-- USER & PROFILE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  avatar_url VARCHAR(500),
  role VARCHAR(20) NOT NULL DEFAULT 'student',
  account_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  email_verified BOOLEAN DEFAULT FALSE,
  last_name_change TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  date_of_birth DATE,
  nationality VARCHAR(100),
  passport_number VARCHAR(50) UNIQUE,
  current_address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  last_qualification VARCHAR(100),
  institution VARCHAR(255),
  gpa VARCHAR(10),
  ielts_score VARCHAR(10),
  ielts_status VARCHAR(20),
  preferred_country VARCHAR(100),
  desired_degree VARCHAR(100),
  budget_range VARCHAR(50),
  preferred_intake VARCHAR(20),
  profile_completion DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  specialization VARCHAR(100),
  bio TEXT,
  assigned_students_count INT DEFAULT 0,
  commission_rate DECIMAL(5,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- UNIVERSITIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  ranking INT,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  description TEXT,
  programs TEXT[] DEFAULT ARRAY[]::TEXT[],
  tuition_range VARCHAR(100),
  has_scholarships BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- APPLICATIONS TABLE
-- ============================================

CREATE TYPE application_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'accepted',
  'rejected',
  'visa_applied',
  'visa_approved',
  'visa_rejected',
  'enrolled'
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  university_id UUID NOT NULL REFERENCES universities(id),
  program_name VARCHAR(255) NOT NULL,
  status application_status DEFAULT 'draft',
  stage VARCHAR(100),
  counselor_id UUID REFERENCES profiles(id),
  counselor_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  decided_at TIMESTAMP WITH TIME ZONE,
  offer_letter_url VARCHAR(500),
  cas_number VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================

CREATE TYPE document_type AS ENUM (
  'passport',
  'transcript',
  'degree',
  'ielts_result',
  'sop',
  'recommendation',
  'cv',
  'financial',
  'photo',
  'other'
);

CREATE TYPE document_status AS ENUM (
  'pending',
  'verified',
  'rejected',
  'needs_reupload'
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(255),
  file_size INT,
  mime_type VARCHAR(100),
  status document_status DEFAULT 'pending',
  verified_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CONSULTATIONS TABLE
-- ============================================

CREATE TYPE consultation_status AS ENUM (
  'scheduled',
  'completed',
  'cancelled',
  'rescheduled'
);

CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES profiles(id),
  title VARCHAR(255),
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INT DEFAULT 30,
  status consultation_status DEFAULT 'scheduled',
  meeting_url VARCHAR(500),
  meeting_type VARCHAR(50),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TICKETS TABLE
-- ============================================

CREATE TYPE ticket_status AS ENUM (
  'open',
  'in_progress',
  'waiting_customer',
  'resolved',
  'closed'
);

CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id),
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ticket_status DEFAULT 'open',
  priority VARCHAR(20) DEFAULT 'medium',
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT NOT NULL,
  attachments TEXT[],
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_ids UUID[] NOT NULL,
  title VARCHAR(255),
  is_group BOOLEAN DEFAULT FALSE,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  attachments TEXT[],
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PAYMENTS & INVOICES
-- ============================================

CREATE TYPE payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded'
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'PKR',
  description VARCHAR(255),
  payment_method VARCHAR(50),
  status payment_status DEFAULT 'pending',
  transaction_id VARCHAR(100),
  paid_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  payment_id UUID REFERENCES payments(id),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  due_date DATE,
  issued_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'draft',
  pdf_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50),
  related_to VARCHAR(50),
  related_id VARCHAR(100),
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ACTIVITY LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(100),
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LEADS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  country VARCHAR(100),
  desired_degree VARCHAR(100),
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  assigned_to UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SETTINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_account_status ON profiles(account_status);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_university_id ON applications(university_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_consultations_student_id ON consultations(student_id);
CREATE INDEX idx_consultations_staff_id ON consultations(staff_id);
CREATE INDEX idx_consultations_scheduled_at ON consultations(scheduled_at);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);

-- ============================================
-- INSERT DEFAULT ROLES
-- ============================================

INSERT INTO roles (name, description) VALUES
  ('student', 'Student user role'),
  ('staff', 'Staff member role'),
  ('admin', 'Administrator role'),
  ('super_admin', 'Super administrator role')
ON CONFLICT DO NOTHING;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read their own profile and admins can read all
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- STUDENT_PROFILES: Students can view their own, staff/admins can view all
CREATE POLICY "Students can view their own profile"
  ON student_profiles FOR SELECT
  USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'super_admin'));

-- APPLICATIONS: Students see own, staff see assigned, admins see all
CREATE POLICY "Students can view their own applications"
  ON applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view assigned applications"
  ON applications FOR SELECT
  USING (counselor_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- DOCUMENTS: Students see own, staff/admin see assigned
CREATE POLICY "Students can view their own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff and admin can view all documents"
  ON documents FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'super_admin'));

-- CONSULTATIONS: Users see their own, admins see all
CREATE POLICY "Users can view their consultations"
  ON consultations FOR SELECT
  USING (student_id = auth.uid() OR staff_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- MESSAGES: Users in conversation can view
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (sender_id = auth.uid() OR conversation_id IN (
    SELECT id FROM conversations WHERE auth.uid() = ANY(participant_ids)
  ));

-- NOTIFICATIONS: Users see their own
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());
