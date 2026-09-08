import { Link } from 'react-router-dom'
import BrandMark from './BrandMark.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-zinc-100 dark:border-slate-700 dark:bg-ink">
      <div className="mx-auto grid w-[min(1180px,calc(100%-24px))] gap-8 py-8 sm:w-[min(1180px,calc(100%-32px))] sm:py-10 md:grid-cols-[1.4fr_0.8fr_1fr]">
        <div>
          <BrandMark to="/" />
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Connecting life-saving blood donors with those in need. Join our community and help
            save lives through safe, verified blood donation.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-base font-bold">Quick Links</h3>
          <ul className="m-0 list-none space-y-2 p-0 text-sm">
            <li><Link className="text-slate-500 no-underline hover:text-brand dark:text-slate-400" to="/donors">Find Donors</Link></li>
            <li><Link className="text-slate-500 no-underline hover:text-brand dark:text-slate-400" to="/requests">Blood Requests</Link></li>
            <li><Link className="text-slate-500 no-underline hover:text-brand dark:text-slate-400" to="/doctors">Free Doctor Service</Link></li>
            <li><Link className="text-slate-500 no-underline hover:text-brand dark:text-slate-400" to="/gallery">Gallery</Link></li>
            <li><Link className="text-slate-500 no-underline hover:text-brand dark:text-slate-400" to="/about">About</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-base font-bold">Emergency Contact</h3>
          <p className="mb-2.5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose-50 text-brand dark:bg-brand/15">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M6.5 4h3l1.2 3.2-1.8 1.8a12 12 0 0 0 6.1 6.1l1.8-1.8 3.2 1.2v3A2.5 2.5 0 0 1 17.5 20 15.5 15.5 0 0 1 4 6.5 2.5 2.5 0 0 1 6.5 4Z" /></svg>
            </span>
            <a className="text-inherit no-underline hover:text-brand" href="tel:999">999 (Emergency)</a>
          </p>
          <p className="mb-0 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose-50 text-brand dark:bg-brand/15">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M4 6h16v12H4V6Zm8 6 8-5H4l8 5Z" /></svg>
            </span>
            <a className="text-inherit no-underline hover:text-brand" href="mailto:blood@gmail.com">blood@gmail.com</a>
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400 dark:border-slate-700">
        © {new Date().getFullYear()} BloodConnector. Connecting donors with those in need.
      </div>
    </footer>
  )
}
