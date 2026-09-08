import { Link } from 'react-router-dom'
import BrandMark from './BrandMark.jsx'
import { pageWidth } from '../lib/classes.js'

export default function Footer() {
  return (
    <footer className="mt-4 border-t border-slate-200 bg-navy text-white dark:border-slate-800">
      <div className={`${pageWidth} grid gap-10 py-12 md:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]`}>
        <div>
          <BrandMark to="/" inverse />
          <p className="mt-4 mb-0 max-w-md text-sm leading-relaxed text-white/70">
            Patients request blood. Donors answer. Doctors keep both sides safe. One verified network
            for Bangladesh.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold tracking-wide text-white uppercase">Network</h3>
          <ul className="m-0 list-none space-y-2 p-0 text-sm">
            <li><Link className="text-white/70 no-underline hover:text-white" to="/requests">Requests</Link></li>
            <li><Link className="text-white/70 no-underline hover:text-white" to="/donors">Donors</Link></li>
            <li><Link className="text-white/70 no-underline hover:text-white" to="/doctors">Doctors</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold tracking-wide text-white uppercase">Community</h3>
          <ul className="m-0 list-none space-y-2 p-0 text-sm">
            <li><Link className="text-white/70 no-underline hover:text-white" to="/gallery">Gallery</Link></li>
            <li><Link className="text-white/70 no-underline hover:text-white" to="/about">About</Link></li>
            <li><Link className="text-white/70 no-underline hover:text-white" to="/signup">Create account</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold tracking-wide text-white uppercase">Emergency</h3>
          <p className="mb-2 text-sm text-white/70">
            <a className="text-inherit no-underline hover:text-white" href="tel:999">999 (National)</a>
          </p>
          <p className="mb-0 text-sm text-white/70">
            <a className="text-inherit no-underline hover:text-white" href="mailto:blood@gmail.com">blood@gmail.com</a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} BloodConnector. Patients, donors, and doctors — connected.
      </div>
    </footer>
  )
}
