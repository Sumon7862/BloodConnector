export default function AuthLayout({ children, toast }) {
  return (
    <div className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-x-hidden sm:min-h-[calc(100svh-72px)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(225,29,45,0.08),transparent_42%)] dark:bg-[radial-gradient(circle_at_50%_8%,rgba(244,63,94,0.16),transparent_46%)]"
        aria-hidden="true"
      />
      <main className="relative z-10 mx-auto my-6 flex w-[min(440px,calc(100%-24px))] flex-col items-center sm:my-10">
        <section
          className="w-full rounded-xl border border-slate-200 bg-white px-5 pt-7 pb-6 shadow-[0_10px_30px_rgba(17,24,39,0.08)] sm:px-8 sm:pt-9 sm:pb-7 dark:border-slate-700 dark:bg-panel dark:shadow-[0_18px_48px_rgba(0,0,0,0.45)]"
          aria-labelledby="auth-card-title"
        >
          {toast ? (
            <div
              className="mb-[18px] rounded-lg bg-emerald-50 px-3 py-2.5 text-[13px] font-medium text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300"
              role="status"
            >
              {toast.message}
            </div>
          ) : null}
          {children}
        </section>
      </main>
    </div>
  )
}
