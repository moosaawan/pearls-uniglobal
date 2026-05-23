// Brand constants
export const BRAND = {
  name: 'Pearls UniGlobal',
  fullName: 'Pearls UniGlobal Consultants',
  tagline: 'Study Abroad Consultants',
  description:
    'Pearls Uni Global Consultants is a premier and highly professional provider of education consultancy services in Pakistan, offering customer-oriented services that focus on individual care and personal attention to every student since 2008.',
  phone: '+92 3446614448',
  phone2: '+92 3461699225',
  whatsapp: '923496601310',
  email: 'admissions@uniglobal.uk',
  address: 'Pearls Education City, Jhang Road, Bhowana, Chiniot, Pakistan',
  website: 'https://pearlsuniglobal.uk',
  established: 2008,
  social: {
    facebook: 'https://facebook.com/pearlsuniglobal',
    instagram: 'https://instagram.com/pearlsuniglobal',
    linkedin: 'https://linkedin.com/company/pearlsuniglobal',
    twitter: 'https://twitter.com/pearlsuniglobal',
    youtube: 'https://youtube.com/@pearlsuniglobal',
  },
} as const

// Managing Director Message
export const MD_MESSAGE = {
  name: 'M.S. Waheed',
  title: 'Managing Director',
  message: `It is with great pleasure that I extend a warm welcome to you on behalf of Pearls Uni Global Consultants. Since our establishment in 2008, our dedicated team and I have been steadfastly committed to excellence in providing professional advice to students aspiring to pursue higher education in the United Kingdom. Pearls Uni Global Consultants joins the Pearls family as a premier and highly professional provider of education consultancy services in Pakistan. Our unwavering dedication to excellence has been the cornerstone of our journey thus far, and we remain resolute in pursuing this vision with total devotion and unflinching integrity.`,
} as const

// Vision, Mission, Values
export const BRAND_IDENTITY = {
  vision: 'To help and guide students in enrolling in international universities and colleges in the United Kingdom and beyond.',
  mission: 'To provide professional, judicious, and friendly services to the students aspiring to study abroad and to endeavour our best in assisting students and parents in the fulfilment of their aspirations.',
  values: ['Truth', 'Transparency', 'Trust'],
} as const

// Team members
export const TEAM_MEMBERS = [
  {
    name: 'M.S. Waheed',
    role: 'Managing Director',
    image: null,
    bio: 'Founder and Managing Director of Pearls UniGlobal Consultants, leading the organisation since 2008 with a vision to provide world-class education consultancy services to students aspiring to study in the UK and beyond.',
  },
  {
    name: 'Bushra Abid Awan',
    role: 'Study Visa Consultant',
    image: '/team images/Bushra Abid Awan.jpeg',
    bio: 'Your trusted student visa consultant, guiding students to their dream universities in the UK. Offers expert advice on visa applications, university selection, and scholarship opportunities with a personalised approach ensuring a smooth journey toward study-abroad dreams.',
  },
  {
    name: 'Saba Waqar',
    role: 'Admissions Manager',
    image: '/team images/Saba Waqar.jpeg',
    bio: 'Specialises in guiding students towards their academic aspirations in UK universities. With expertise in the UK education system and training from the British Council, facilitates a seamless admission process to the university and course of your choice.',
  },
  {
    name: 'Ali Shamraiz Jappa',
    role: 'Admissions & Visa Consultant',
    image: '/team images/Ali Shamraiz Jappa.jpeg',
    bio: 'A UK student visa expert helping students achieve their dreams of studying in the UK. Guides students from choosing the right university to securing their CAS and assisting with the visa application process.',
  },
  {
    name: 'Waleed Abdullah',
    role: 'Admissions & Visa Consultant',
    image: '/team images/Waleed Abdullah.jpeg',
    bio: 'A dedicated visa consultant with a strong background in Computer Science. Combines tech expertise with a passion for helping students achieve their study abroad dreams through personalised guidance, efficient processing, and expert documentation advice.',
  },
] as const

// Navigation links
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Study in UK', href: '/study-in-uk' },
  { label: 'Services', href: '/services' },
  { label: 'IELTS Academy', href: '/ielts-academy' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const

// Services
export const SERVICES = [
  {
    id: 'profile-assessment',
    title: 'Profile Assessment',
    description:
      'Comprehensive evaluation of your academic background, test scores, and career goals to determine the best path forward.',
    icon: 'ClipboardCheck',
  },
  {
    id: 'university-selection',
    title: 'University Selection',
    description:
      'Expert guidance in choosing the right UK university and program that aligns with your aspirations and budget.',
    icon: 'GraduationCap',
  },
  {
    id: 'sop-guidance',
    title: 'SOP Guidance',
    description:
      'Professional assistance in crafting compelling Statements of Purpose that make your application stand out.',
    icon: 'FileText',
  },
  {
    id: 'ielts-preparation',
    title: 'IELTS Preparation',
    description:
      'Structured IELTS coaching with expert trainers to achieve your target band score for UK university admission.',
    icon: 'BookOpen',
  },
  {
    id: 'visa-guidance',
    title: 'Visa Guidance',
    description:
      'End-to-end UK student visa application support with high success rates and expert documentation review.',
    icon: 'Shield',
  },
  {
    id: 'tb-test',
    title: 'TB Test Appointment',
    description:
      'Hassle-free TB test appointment booking at approved centers, a mandatory requirement for UK visa applicants.',
    icon: 'Stethoscope',
  },
  {
    id: 'interview-prep',
    title: 'Interview Preparation',
    description:
      'Mock interview sessions and expert tips to confidently handle credibility interviews and university interviews.',
    icon: 'Users',
  },
  {
    id: 'scholarship-guidance',
    title: 'Scholarship Guidance',
    description:
      'Identify and apply for scholarships and funding opportunities to make your UK education more affordable.',
    icon: 'Award',
  },
  {
    id: 'pre-departure',
    title: 'Pre-departure Assistance',
    description:
      'Comprehensive support for travel planning, accommodation, bank accounts, and settling into UK life.',
    icon: 'Plane',
  },
] as const

// Stats
export const STATS = [
  { label: 'Students Placed', value: 2500, suffix: '+' },
  { label: 'Partner Universities', value: 150, suffix: '+' },
  { label: 'Visa Success Rate', value: 98, suffix: '%' },
  { label: 'Years Experience', value: 17, suffix: '+' },
] as const

// Visa process timeline
export const VISA_TIMELINE = [
  {
    step: 1,
    title: 'Free Consultation',
    description: 'Book a free consultation with our expert counselors to discuss your goals.',
  },
  {
    step: 2,
    title: 'Profile Assessment',
    description: 'We evaluate your academic background, finances, and career objectives.',
  },
  {
    step: 3,
    title: 'University Selection',
    description: 'We shortlist the best UK universities matching your profile and preferences.',
  },
  {
    step: 4,
    title: 'Application Submission',
    description: 'We prepare and submit your applications with perfect documentation.',
  },
  {
    step: 5,
    title: 'Offer Letter',
    description: 'Receive your offer letter and CAS from your chosen university.',
  },
  {
    step: 6,
    title: 'Visa Application',
    description: 'Complete visa documentation, TB test, and submit your UK student visa.',
  },
  {
    step: 7,
    title: 'Visa Approval',
    description: 'Receive your visa approval and prepare for your journey to the UK.',
  },
  {
    step: 8,
    title: 'Pre-departure',
    description: 'Attend our pre-departure briefing and fly to start your UK adventure!',
  },
] as const

// Countries
export const COUNTRIES = [
  'United Kingdom',
  'Australia',
  'Canada',
  'United States',
  'Ireland',
  'New Zealand',
  'Germany',
  'Malaysia',
] as const

// Degree levels
export const DEGREE_LEVELS = [
  'Foundation',
  'Undergraduate (Bachelors)',
  'Postgraduate (Masters)',
  'PhD / Doctorate',
  'Pre-Masters',
  'HND/HNC',
] as const

// IELTS status options
export const IELTS_STATUS = [
  'Already taken (have score)',
  'Booked (upcoming test)',
  'Preparing',
  'Not started',
  'Exempt / Not required',
] as const

// Budget ranges
export const BUDGET_RANGES = [
  'Below £10,000',
  '£10,000 - £15,000',
  '£15,000 - £20,000',
  '£20,000 - £25,000',
  '£25,000 - £30,000',
  'Above £30,000',
] as const

// Intake options
export const INTAKE_OPTIONS = [
  'January 2025',
  'May 2025',
  'September 2025',
  'January 2026',
  'May 2026',
  'September 2026',
] as const

// Application statuses with colors
export const APPLICATION_STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'gray', icon: 'FileEdit' },
  submitted: { label: 'Submitted', color: 'blue', icon: 'Send' },
  under_review: { label: 'Under Review', color: 'yellow', icon: 'Eye' },
  accepted: { label: 'Accepted', color: 'green', icon: 'CheckCircle' },
  rejected: { label: 'Rejected', color: 'red', icon: 'XCircle' },
  visa_applied: { label: 'Visa Applied', color: 'purple', icon: 'FileCheck' },
  visa_approved: { label: 'Visa Approved', color: 'emerald', icon: 'BadgeCheck' },
  visa_rejected: { label: 'Visa Rejected', color: 'red', icon: 'ShieldX' },
  enrolled: { label: 'Enrolled', color: 'gold', icon: 'GraduationCap' },
} as const

// Qualifications
export const QUALIFICATIONS = [
  'Matriculation / O-Levels',
  'Intermediate / A-Levels',
  'Bachelors Degree',
  'Masters Degree',
  'MPhil',
  'PhD',
  'Diploma',
  'HND/HNC',
] as const

// Real FAQs from company documents
export const REAL_FAQS = [
  {
    category: 'Application Process',
    questions: [
      {
        q: 'How can a Pakistani student apply to study in the UK?',
        a: 'Pakistani students should choose a course and university, apply for admission, and receive a Confirmation of Acceptance for Studies (CAS) from the UK institution. With the CAS, you can apply for the UK student visa online. Pearls Uni Global Consultants can guide you through each step of the admission process, from application to visa filing.',
      },
      {
        q: 'How can I get admission into UK universities from Pakistan?',
        a: 'Research universities, meet academic and English requirements, prepare your documents (transcripts, recommendations, personal statement), and apply online. Pearls Uni Global Consultants provides step-by-step support throughout your application process.',
      },
      {
        q: 'What is the CAS letter and how do I get it?',
        a: 'The CAS (Confirmation of Acceptance for Studies) is an official document from your UK university confirming your admission. You receive it after you accept your offer and meet any conditions set by the university.',
      },
    ],
  },
  {
    category: 'Visa Requirements',
    questions: [
      {
        q: 'What are the requirements for a UK student visa from Pakistan?',
        a: 'You need a valid passport, a CAS letter, proof of funds, evidence of English proficiency (such as IELTS), academic transcripts, tuberculosis (TB) test results, and passport-sized photos. Pearls Uni Global Consultants will help you prepare and organise all required documents.',
      },
      {
        q: 'What documents are needed for a UK student visa?',
        a: 'You need a valid passport, CAS letter, proof of funds, academic certificates, English test scores, TB test results, passport photos, and sometimes an ATAS certificate (for specific courses). Pearls Uni Global Consultants ensures your documentation is complete and accurate.',
      },
      {
        q: 'What is the UK student visa success rate for Pakistani students?',
        a: 'The UK student visa success rate for Pakistani students has been very high, around 95–98%. Properly preparing your application and documents increases your chances of approval.',
      },
      {
        q: 'How long does it take to process a UK student visa from Pakistan?',
        a: 'Standard processing time is about 3 weeks (15 working days), but it may take longer during peak periods or if extra documents are needed.',
      },
    ],
  },
  {
    category: 'Costs & Finance',
    questions: [
      {
        q: 'How much does it cost to study in the UK for Pakistani students?',
        a: 'Tuition fees usually range from £15,000 to £23,000 per year for most courses, while MBBS and other specialised programs may cost more. Living expenses typically range from £10,000 to £13,000 per year, depending on the city and lifestyle.',
      },
      {
        q: 'What is the minimum bank statement required for a UK student visa?',
        a: 'You must show funds for tuition and living expenses. For London, at least £1,334 per month for up to 9 months; for other cities, £1,023 per month. The statement should cover 28 days and include any remaining tuition fees.',
      },
      {
        q: 'Are any scholarships or financial aid opportunities available through Pearls Uni Global Consultants?',
        a: 'Yes, Pearls Uni Global Consultants informs students about various scholarships, grants, and financial aid options available for international students. These opportunities are based on academic excellence, leadership skills, and other criteria.',
      },
    ],
  },
  {
    category: 'IELTS & Language',
    questions: [
      {
        q: 'Is IELTS required to study in the UK from Pakistan?',
        a: 'Most UK universities require IELTS, with minimum scores ranging from 5.5 to 6.5, depending on the program. Some universities may accept alternatives or offer exemptions in special cases. Pearls Uni Global Consultants can advise you on university-specific language requirements.',
      },
    ],
  },
  {
    category: 'Our Services',
    questions: [
      {
        q: 'How can Pearls Uni Global Consultants help me with the UK study visa process?',
        a: 'Pearls Uni Global Consultants offer personalised guidance for university selection, application preparation, visa guidance, and pre-departure support. Our expert team ensures you meet all requirements for a successful study abroad journey.',
      },
      {
        q: 'Do Pearls Uni Global Consultants charge any fee for their consultation services?',
        a: 'No, our study abroad consultation services are completely free of charge. At Pearls Uni Global Consultants, we are passionate about helping students achieve their dreams of studying at top destinations worldwide.',
      },
      {
        q: 'Can Pearls Uni Global Consultants assist with pre-departure preparations and travel arrangements?',
        a: 'Yes, we provide valuable assistance with pre-departure preparations, including booking flights, arranging accommodation, airport transfers, and orientation programs.',
      },
      {
        q: 'Do Pearls Uni Global Consultants offer online consultation?',
        a: 'Yes, we offer free online consultations to accommodate students who prefer virtual meetings or cannot visit our offices in person.',
      },
      {
        q: 'Does Pearls Uni Global Consultants arrange study abroad expos throughout Pakistan?',
        a: 'Yes, we organise study-abroad expos across Pakistan. For further information about upcoming expos, please visit our website or call us today.',
      },
      {
        q: 'Can Pearls Uni Global provide information on post-study work opportunities?',
        a: 'Yes, we offer insights into post-study work opportunities, including regulations, eligibility criteria, and the duration of post-study work permits.',
      },
      {
        q: 'Can I work while studying abroad?',
        a: 'Yes, most countries allow international students to work part-time during their studies. We provide information on the regulations and opportunities available in your chosen destination.',
      },
      {
        q: 'How can I contact Pearls Uni Global Consultants for help or queries?',
        a: 'For any help or queries, you can email us at admissions@uniglobal.uk. Additionally, you can contact our Q&A Department at +923496601310 (WhatsApp) for further assistance. Our support team is ready to assist you with personalised guidance.',
      },
      {
        q: 'What is the significance of Pearls Uni Global Consultants in the educational consultancy field?',
        a: 'Established in 2008, Pearls Uni Global Consultants is a well-known educational consultancy firm in Pakistan, with extensive experience and a vast network of partnerships, offering comprehensive support to students seeking to study abroad.',
      },
    ],
  },
] as const
