export const BLOOD_COMPAT = [
  { type: 'O+', donate: 'O+, A+, B+, AB+', receive: 'O+, O-' },
  { type: 'O-', donate: 'All', receive: 'O-' },
  { type: 'A+', donate: 'A+, AB+', receive: 'A+, A-, O+, O-' },
  { type: 'A-', donate: 'A+, A-, AB+, AB-', receive: 'A-, O-' },
  { type: 'B+', donate: 'B+, AB+', receive: 'B+, B-, O+, O-' },
  { type: 'B-', donate: 'B+, B-, AB+, AB-', receive: 'B-, O-' },
  { type: 'AB+', donate: 'AB+', receive: 'All' },
  { type: 'AB-', donate: 'AB+, AB-', receive: 'AB-, A-, B-, O-' },
]

export const URGENT_REQUESTS = [
  { id: 'r1', type: 'O-', location: 'City Hospital Emergency Ward', level: 'Critical' },
  { id: 'r2', type: 'AB+', location: 'Dhaka Medical College', level: 'High' },
  { id: 'r3', type: 'B-', location: 'Square Hospital, Panthapath', level: 'Critical' },
]

export const UPCOMING_EVENTS = [
  { id: 'e1', name: 'Fall Health Initiative', date: 'October 25, 2025', location: 'Regional Medical Center' },
  { id: 'e2', name: 'Community Health Drive', date: 'November 12, 2025', location: 'Dhanmondi Community Hall' },
  { id: 'e3', name: 'Campus Blood Camp', date: 'December 3, 2025', location: 'DU TSC Ground' },
]

export const RECENT_ACTIVITY = [
  { id: 'a1', text: 'Completed donation at City General Hospital', time: '2 days ago' },
  { id: 'a2', text: 'Responded to an O- emergency request', time: '5 days ago' },
  { id: 'a3', text: 'Updated your donor profile details', time: '1 week ago' },
  { id: 'a4', text: 'Joined BloodConnector community gallery', time: '2 weeks ago' },
]

export const DONATION_HISTORY = [
  {
    id: 'd1',
    title: 'Corporate Blood Drive',
    status: 'Completed',
    date: 'April 25, 2025',
    location: 'Tech Park Convention Center',
  },
  {
    id: 'd2',
    title: 'Fall Health Initiative',
    status: 'Upcoming',
    date: 'October 25, 2025',
    location: 'Regional Medical Center',
  },
]

export const CONSULT_DOCTORS = [
  {
    id: 'sarah',
    name: 'Dr. Sarah Johnson',
    specialty: 'Hematologist',
    rating: '4.9',
    available: true,
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'michael',
    name: 'Dr. Michael Chen',
    specialty: 'General Physician',
    rating: '4.8',
    available: true,
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'emily',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Internal Medicine',
    rating: '4.7',
    available: false,
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
]

export const DEFAULT_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Urgent Blood Request',
    message: 'O- blood needed at City Hospital Emergency Ward',
    time: '5 min ago',
    unread: true,
    tone: 'drop',
  },
  {
    id: 'n2',
    title: 'Upcoming Campaign Reminder',
    message: 'Community Health Drive is tomorrow at 9 AM',
    time: '2 hours ago',
    unread: true,
    tone: 'clock',
  },
  {
    id: 'n3',
    title: 'Donation Impact',
    message: 'Your last donation helped save 3 lives!',
    time: '1 day ago',
    unread: false,
    tone: 'heart',
  },
  {
    id: 'n4',
    title: 'New Gallery Story',
    message: 'A donor in Mirpur shared how BloodConnector helped their family.',
    time: '2 days ago',
    unread: false,
    tone: 'bell',
  },
]

export const SEED_APPOINTMENTS = [
  {
    id: 'ap1',
    name: 'Rahim Uddin',
    detail: 'Donor eligibility screening',
    date: 'Sep 12, 2026',
    mode: 'Phone Call',
    status: 'Upcoming',
  },
  {
    id: 'ap2',
    name: 'Ayesha Rahman',
    detail: 'Post-donation health advice',
    date: 'Aug 28, 2026',
    mode: 'Video Call',
    status: 'Completed',
  },
]

export const SEED_FAMILY = [
  {
    id: 'f1',
    name: 'Nusrat Doe',
    bloodType: 'A+',
    relation: 'Spouse',
    email: 'nusrat@gmail.com',
    phone: '+8801711002002',
    eligible: '2024-04-10',
    available: true,
  },
  {
    id: 'f2',
    name: 'Ayaan Doe',
    bloodType: 'O-',
    relation: 'Son',
    email: 'ayaan@gmail.com',
    phone: '+8801711002003',
    eligible: '2026-01-12',
    available: true,
  },
]
