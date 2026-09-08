export default function Field({ id, label, error, hint, hintOk = false, children }) {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <label htmlFor={id} className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
        {label}
      </label>
      {children}
      {error ? (
        <p className="m-0 text-xs text-brand" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className={`m-0 text-xs ${hintOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
