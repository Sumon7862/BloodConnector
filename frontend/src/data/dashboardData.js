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
