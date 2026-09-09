export const HOW_IT_WORKS = [
  {
    step: '1',
    kicker: 'Request',
    title: 'Ask for help',
    copy: 'Create a blood request with your type and location. Matching donors are notified at once.',
  },
  {
    step: '2',
    kicker: 'Match',
    title: 'Donors see it',
    copy: 'People with the same blood group get the request and can call you.',
  },
  {
    step: '3',
    kicker: 'Donate',
    title: 'Give blood',
    copy: 'A matching donor responds, donates, and the request can be marked filled.',
  },
]

export const NETWORK_ROLES = [
  {
    kicker: 'Need blood',
    title: 'Request blood',
    copy: 'Post a request with your blood type and location. Matching donors see it instantly.',
    cta: 'Request blood',
    authTo: '/request-blood',
    guestTo: '/login',
  },
  {
    kicker: 'Give blood',
    title: 'Donate blood',
    copy: 'Stay eligible, answer matching requests, and help someone who needs your group today.',
    cta: 'Find who needs you',
    authTo: '/(tabs)/requests',
    guestTo: '/(tabs)/requests',
  },
] as const
