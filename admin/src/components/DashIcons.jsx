export function Icon({ name, className = 'h-5 w-5' }) {
  const props = {
    viewBox: '0 0 24 24',
    className: `${className} fill-none stroke-current stroke-[1.8]`,
    'aria-hidden': true,
  }
  const paths = {
    home: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />,
    drop: <path d="M12 3s6 7.2 6 11.2A6 6 0 1 1 6 14.2C6 10.2 12 3 12 3Z" />,
    heart: <path d="M12 20s-6.5-4.2-9.2-8.2C.8 8.6 1.6 4.7 4.9 3.4 7 2.6 9.2 3.4 12 6c2.8-2.6 5-3.4 7.1-2.6 3.3 1.3 4.1 5.2 2.1 8.4C18.5 15.8 12 20 12 20Z" />,
    gallery: (
      <>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.4" />
        <path d="m8 16 3-3 3 2 2-2 3 3" />
      </>
    ),
    types: (
      <>
        <path d="M8 4s3.5 4.2 3.5 6.5A3.5 3.5 0 1 1 4.5 10.5C4.5 8.2 8 4 8 4Z" />
        <path d="M16 9s3.5 4.2 3.5 6.5A3.5 3.5 0 1 1 12.5 15.5C12.5 13.2 16 9 16 9Z" />
      </>
    ),
    consult: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20c.8-3.4 3.4-5 7-5s6.2 1.6 7 5" />
        <path d="M19 4v4M17 6h4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c1-3.6 3.6-5.5 7-5.5s6 1.9 7 5.5" />
      </>
    ),
    bell: (
      <>
        <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9Z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </>
    ),
    gear: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3.5v2.2M12 18.3V20.5M4.9 6.5l1.6 1.6M17.5 16.9l1.6 1.6M3.5 12h2.2M18.3 12H20.5M4.9 17.5l1.6-1.6M17.5 7.1l1.6-1.6" />
      </>
    ),
    pin: <path d="M12 21s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10Z" />,
    phone: <path d="M6.5 4h3l1.2 3.2-1.8 1.8a12 12 0 0 0 6.1 6.1l1.8-1.8 3.2 1.2v3A2.5 2.5 0 0 1 17.5 20 15.5 15.5 0 0 1 4 6.5 2.5 2.5 0 0 1 6.5 4Z" />,
    mail: <path d="M4 7h16v10H4V7Zm0 0 8 6 8-6" />,
    calendar: (
      <>
        <rect x="4" y="6" width="16" height="14" rx="2" />
        <path d="M8 4v4M16 4v4M4 10h16" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5l3 2" />
      </>
    ),
    video: (
      <>
        <rect x="3" y="7" width="12" height="10" rx="2" />
        <path d="m15 10 6-3v10l-6-3" />
      </>
    ),
    chat: <path d="M5 6h14v9H8l-3 3V6Z" />,
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-3.2-3.2" />
      </>
    ),
    check: <path d="m5 12 5 5 9-10" />,
    star: <path d="m12 3 2.4 5.6L20 9.3l-4 4.3.9 6.4L12 17l-4.9 3 1-6.4-4-4.3 5.6-.7L12 3Z" />,
    lock: (
      <>
        <rect x="6" y="11" width="12" height="9" rx="2" />
        <path d="M9 11V8a3 3 0 0 1 6 0v3" />
      </>
    ),
    shield: <path d="M12 3 5 6v6c0 4.2 2.8 7.2 7 9 4.2-1.8 7-4.8 7-9V6l-7-3Z" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M3 12h18M12 4c2.5 2.4 3.8 5.1 3.8 8S14.5 17.6 12 20c-2.5-2.4-3.8-5.1-3.8-8S9.5 6.4 12 4Z" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    people: (
      <>
        <circle cx="9" cy="8" r="2.6" />
        <path d="M3.8 19c.7-3 2.8-4.6 5.2-4.6S13.5 16 14.2 19" />
        <circle cx="16.5" cy="8.5" r="2.2" />
        <path d="M16.5 14.4c2 0 3.8 1.3 4.5 3.6" />
      </>
    ),
    trash: (
      <>
        <path d="M5 7h14M9 7V5h6v2M8 7l.8 12h6.4L16 7" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    alert: (
      <>
        <path d="M12 4 3.5 19h17L12 4Z" />
        <path d="M12 10v4M12 16.5v.5" />
      </>
    ),
    pulse: <path d="M3 13h4l2-6 3 12 2-8h3l2 4h2" />,
    building: (
      <>
        <path d="M5 20V6l7-3 7 3v14" />
        <path d="M9 20v-5h6v5M9 9h.01M12 9h.01M15 9h.01M9 13h.01M12 13h.01M15 13h.01" />
      </>
    ),
  }
  return <svg {...props}>{paths[name]}</svg>
}
