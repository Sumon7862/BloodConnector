export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export type User = {
  id: string
  name: string
  emailOrPhone: string
  role: 'donor' | 'admin' | string
  status: string
  bloodGroup?: string
  age?: string
  address?: string
  photo?: string
  phone?: string
  phones?: string[]
  email?: string
  weight?: string
  emergencyContact?: string
  medicalConditions?: string
  available?: boolean
  joinedAt?: string
  lastDonatedAt?: string
  nextEligibleAt?: string
  donationCount?: number
  hasPassword?: boolean
}

export type Donor = {
  id: string
  name: string
  bloodType?: string
  location?: string
  area?: string
  city?: string
  phone?: string
  email?: string
  photo?: string
  nextEligibleAt?: string
  nextEligible?: string
  status?: string
  donations?: Donation[]
}

export type Donation = {
  id?: string
  type?: string
  status?: string
  date?: string
  location?: string
  amountMl?: number
  recipient?: string
  bloodBank?: string
}

export type RequestResponse = {
  id: string
  donorId: string
  donorName: string
  donorPhoto?: string
  donorBloodType?: string
  donorPhone?: string
  message?: string
  createdAt?: string
  status?: string
}

export type BloodRequest = {
  id: string
  requesterId: string
  requesterName: string
  requesterPhoto?: string
  bloodType: string
  urgency: string
  location: string
  contact?: string
  details?: string
  createdAt: string
  status: 'open' | 'filled' | 'closed' | 'matched' | string
  responses?: RequestResponse[]
  dismissedBy?: string[]
  dismissed?: boolean
}

export type AppNotification = {
  id: string
  title: string
  message: string
  to?: string
  tone?: string
  unread?: boolean
  createdAt?: string
}

export type Opinion = {
  id: string
  name: string
  role?: string
  location?: string
  rating?: number
  opinion: string
  photo?: string
  createdAt?: string
}
