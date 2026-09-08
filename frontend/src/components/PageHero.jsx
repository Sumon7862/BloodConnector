import { pageWidth } from '../lib/classes.js'

export default function PageHero({ eyebrow, title, children, actions, tone = 'navy' }) {
  return (
    <section className={`relative overflow-hidden text-white ${tone === 'brand' ? 'bg-brand' : 'bg-navy'}`}>
      <div
        className={`pointer-events-none absolute inset-0 ${
          tone === 'brand'
            ? 'bg-[radial-gradient(circle_at_78%_20%,rgba(255,255,255,0.18),transparent_42%)]'
            : 'bg-[radial-gradient(circle_at_82%_12%,rgba(225,29,45,0.42),transparent_40%)]'
        }`}
        aria-hidden="true"
      />
      <div className={`relative ${pageWidth} grid items-end gap-6 py-12 sm:py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 lg:py-[72px]`}>
        <div>
          {eyebrow ? (
            <p className="m-0 text-[11px] font-bold tracking-[0.22em] text-white/70 uppercase">{eyebrow}</p>
          ) : null}
          <h1 className={`m-0 text-[clamp(32px,6vw,52px)] leading-[1.08] font-extrabold tracking-tight text-white ${eyebrow ? 'mt-3' : ''}`}>
            {title}
          </h1>
        </div>
        <div>
          {children ? (
            <div className="max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-base">{children}</div>
          ) : null}
          {actions}
        </div>
      </div>
    </section>
  )
}
