export default function DashPageHead({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="m-0 text-[clamp(26px,4vw,34px)] font-extrabold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 mb-0 flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}
