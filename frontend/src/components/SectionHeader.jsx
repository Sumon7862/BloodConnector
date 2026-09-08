export default function SectionHeader({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <header className={`mb-8 ${align === 'center' ? 'text-center' : ''}`}>
      {eyebrow ? (
        <p className="m-0 text-[11px] font-bold tracking-[0.22em] text-brand uppercase">{eyebrow}</p>
      ) : null}
      <h2 className={`m-0 text-[clamp(24px,3.2vw,34px)] font-extrabold tracking-tight ${eyebrow ? 'mt-2' : ''}`}>
        {title}
      </h2>
      {subtitle ? <p className="mt-2 mb-0 text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
    </header>
  )
}
