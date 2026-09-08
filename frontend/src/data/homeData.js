export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

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
  {
    id: 'square',
    name: 'Square Hospital Blood Bank',
    distance: '4.1 km',
    phone: '+8801913003300',
    map: 'https://maps.google.com/?q=Square+Hospital+Dhaka',
    units: { 'A+': 12, 'B+': 8, 'AB+': 3, 'A-': 5, 'B-': 4, 'AB-': 2, 'O+': 15, 'O-': 7 },
  },
  {
    id: 'dmc',
    name: 'Dhaka Medical College Blood Bank',
    distance: '5.6 km',
    phone: '+8801714004400',
    map: 'https://maps.google.com/?q=Dhaka+Medical+College',
    units: { 'A+': 22, 'B+': 19, 'AB+': 6, 'A-': 9, 'B-': 6, 'AB-': 3, 'O+': 28, 'O-': 11 },
  },
]

export const HOME_STATS = [
  ['3,400+', 'Verified donors'],
  ['12,000+', 'Lives supported'],
  ['48', 'Partner blood banks'],
  ['24/7', 'Doctor support'],
]

export const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Search nearby',
    copy: 'Find verified donors and live blood-bank units by area and blood type.',
  },
  {
    step: '2',
    title: 'Connect safely',
    copy: 'Call, request, or add someone you know. Every profile is easy to reach.',
  },
  {
    step: '3',
    title: 'Donate and recover',
    copy: 'Give blood, track your next eligible date, and get free medical advice.',
  },
]

export const IMPACT_CARDS = [
  {
    id: 'drive',
    title: 'Host a Blood Drive',
    copy: 'Organize a drive at your campus, office, or community center.',
    to: '/gallery',
    action: 'See community stories',
  },
  {
    id: 'volunteer',
    title: 'Become a Volunteer',
    copy: 'Help coordinate donors, requests, and emergency matching.',
    to: '/signup',
    action: 'Create an account',
  },
  {
    id: 'donate',
    title: 'Support the Mission',
    copy: 'Learn how BloodConnector connects families during emergencies.',
    to: '/about',
    action: 'Read about us',
  },
]
