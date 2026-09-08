export const BLOOD_TYPES = ['A+', 'B+', 'AB+', 'A-', 'B-', 'AB-', 'O+', 'O-']

export const BLOOD_BANKS = [
  {
    id: 'pathway',
    name: 'Pathway Blood Care',
    distance: '1.2 km',
    phone: '+8801711001100',
    map: 'https://maps.google.com/?q=Dhaka+Blood+Bank',
    units: { 'A+': 16, 'B+': 11, 'AB+': 4, 'A-': 7, 'B-': 3, 'AB-': 2, 'O+': 21, 'O-': 6 },
  },
  {
    id: 'city',
    name: 'City Life Blood Center',
    distance: '2.8 km',
    phone: '+8801812002200',
    map: 'https://maps.google.com/?q=Dhaka+Medical',
    units: { 'A+': 9, 'B+': 14, 'AB+': 5, 'A-': 2, 'B-': 8, 'AB-': 1, 'O+': 18, 'O-': 4 },
  },
]

export const RECENT_DONORS = [
  {
    id: 'd1',
    name: 'Ayesha Rahman',
    location: 'Dhanmondi, Dhaka',
    bloodType: 'A+',
    lastDonation: '1 week ago',
    nextEligible: 'In 80 Days',
    initials: 'AR',
    tone: 'rose',
  },
  {
    id: 'd2',
    name: 'Rahim Uddin',
    location: 'Gulshan, Dhaka',
    bloodType: 'O+',
    lastDonation: '3 weeks ago',
    nextEligible: 'In 62 Days',
    initials: 'RU',
    tone: 'navy',
  },
  {
    id: 'd3',
    name: 'Nusrat Jahan',
    location: 'Mirpur, Dhaka',
    bloodType: 'B+',
    lastDonation: '5 days ago',
    nextEligible: 'In 85 Days',
    initials: 'NJ',
    tone: 'gold',
  },
]

export const IMPACT_CARDS = [
  {
    id: 'drive',
    title: 'Host a Blood Drive',
    copy: 'Organize a drive at your campus, office, or community center.',
  },
  {
    id: 'volunteer',
    title: 'Become a Volunteer',
    copy: 'Help coordinate donors, campaigns, and emergency requests.',
  },
  {
    id: 'donate',
    title: 'Make a Financial Donation',
    copy: 'Support families who cannot afford emergency transfusion costs.',
  },
]
