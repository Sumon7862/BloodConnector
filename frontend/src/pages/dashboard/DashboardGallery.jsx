import { useEffect, useState } from 'react'
import DashPageHead from '../../components/DashPageHead.jsx'
import DonorAvatar from '../../components/DonorAvatar.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatOpinionDate, loadOpinions, saveOpinion } from '../../data/gallery.js'
import { roleLabel } from '../../lib/user.js'
import { btnPrimary, cardClass, dashInput } from '../../lib/classes.js'

export default function DashboardGallery() {
  const { user } = useAuth()
  const [opinions, setOpinions] = useState(() => loadOpinions())
  const [rating, setRating] = useState(5)
  const [opinion, setOpinion] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    document.title = 'BloodConnector — Gallery'
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    if (!opinion.trim()) {
      setError('Please write your opinion.')
      return
    }
    const next = saveOpinion({
      id: crypto.randomUUID(),
      name: user.name,
      role: roleLabel(user.role),
      location: user.address || '',
      rating,
      opinion: opinion.trim(),
      photo: user.photo || '',
      createdAt: new Date().toISOString(),
    })
    setOpinions(next)
    setOpinion('')
    setRating(5)
    setError('')
    setSaved(true)
  }

  return (
    <div>
      <DashPageHead
        title="Gallery"
        subtitle="Share how BloodConnector helped you. Photo, name, address, and role come from your profile."
      />

      <form className={`${cardClass} p-4 sm:p-6`} onSubmit={handleSubmit} noValidate>
        <h2 className="m-0 text-lg font-extrabold">Share your opinion</h2>
        <p className="mt-1 mb-5 text-sm text-slate-500">You only add a rating and a comment.</p>

        <div className="mb-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-zinc-50 p-3 dark:border-slate-700 dark:bg-panel-2">
          <DonorAvatar name={user.name} photo={user.photo} />
          <div className="min-w-0">
            <p className="m-0 font-extrabold">{user.name}</p>
            <p className="mt-1 mb-0 text-sm text-slate-500">
              {roleLabel(user.role)}
              {user.address ? ` · ${user.address}` : ''}
            </p>
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Rating</legend>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`h-10 w-10 rounded-lg border text-lg ${
                  star <= rating
                    ? 'border-amber-300 bg-amber-50 text-amber-500 dark:bg-amber-400/15'
                    : 'border-slate-200 text-slate-300 dark:border-slate-600'
                }`}
                aria-label={`${star} star${star === 1 ? '' : 's'}`}
                onClick={() => {
                  setRating(star)
                  setSaved(false)
                }}
              >
                ★
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-semibold">Your opinion</span>
          <textarea
            rows="4"
            placeholder="How did BloodConnector help you?"
            value={opinion}
            className={`${dashInput} h-auto min-h-28 py-3`}
            onChange={(event) => {
              setOpinion(event.target.value)
              setSaved(false)
            }}
          />
        </label>

        {error ? <p className="mt-3 mb-0 text-sm font-medium text-brand">{error}</p> : null}
        {saved ? (
          <p className="mt-3 mb-0 text-sm font-medium text-emerald-600">Thank you. Your story is now in the gallery.</p>
        ) : null}

        <button type="submit" className={`${btnPrimary} mt-4 sm:w-auto sm:px-8`}>
          Submit
        </button>
      </form>

      <section className="mt-8">
        <h2 className="m-0 text-lg font-extrabold">Community voices</h2>
        <p className="mt-1 mb-4 text-sm text-slate-500">
          {opinions.length} {opinions.length === 1 ? 'story' : 'stories'} from donors and doctors
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {opinions.map((item) => (
            <article key={item.id} className={`${cardClass} flex flex-col p-5`}>
              <div className="flex items-start gap-3">
                <DonorAvatar name={item.name} photo={item.photo} />
                <div className="min-w-0 flex-1">
                  <h3 className="m-0 truncate text-base font-extrabold">{item.name}</h3>
                  <p className="mt-1 mb-0 text-sm text-slate-500">
                    {item.role}
                    {item.location ? ` · ${item.location}` : ''}
                  </p>
                </div>
              </div>
              <p className="mt-3 mb-0 text-amber-500" aria-label={`${item.rating} out of 5 stars`}>
                {'★'.repeat(item.rating)}
                <span className="text-slate-300 dark:text-slate-600">{'★'.repeat(5 - item.rating)}</span>
              </p>
              <p className="mt-3 mb-0 flex-1 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                “{item.opinion}”
              </p>
              <p className="mt-4 mb-0 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                {formatOpinionDate(item.createdAt)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
