import { useEffect, useState } from 'react'
import DonorAvatar from './DonorAvatar.jsx'
import { deleteOpinion, findUserOpinion, formatOpinionDate, MAX_OPINION_CHARS, saveOpinion } from '../data/gallery.js'
import { accountKey, roleLabel } from '../lib/user.js'
import { btnOutline, btnPrimary, cardClass } from '../lib/classes.js'
import { validateOpinion, validateRating } from '../utils/validation.js'

export default function OpinionEditor({ user, inputClass, onSaved }) {
  const userId = accountKey(user?.emailOrPhone)
  const [mine, setMine] = useState(() => findUserOpinion(userId))
  const [editing, setEditing] = useState(() => !findUserOpinion(userId))
  const [rating, setRating] = useState(() => findUserOpinion(userId)?.rating || 5)
  const [opinion, setOpinion] = useState(() => findUserOpinion(userId)?.opinion || '')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const current = findUserOpinion(userId)
    setMine(current)
    if (!current) setEditing(true)
  }, [userId])

  function startEdit() {
    setOpinion(mine?.opinion || '')
    setRating(mine?.rating || 5)
    setError('')
    setSaved(false)
    setEditing(true)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextError = validateRating(rating) || validateOpinion(opinion, { maxChars: MAX_OPINION_CHARS })
    if (nextError) {
      setSaved(false)
      setError(nextError)
      return
    }
    const nextList = saveOpinion({
      userId,
      name: user.name,
      role: roleLabel(user.role),
      location: user.address || '',
      rating,
      opinion: opinion.trim(),
      photo: user.photo || '',
      createdAt: mine?.createdAt || new Date().toISOString(),
    })
    const nextMine = findUserOpinion(userId)
    setMine(nextMine)
    setEditing(false)
    setError('')
    setSaved(true)
    onSaved?.(nextList)
  }

  return (
    <div className="grid gap-4">
      {mine && !editing ? (
        <article className={`${cardClass} p-4 sm:p-6`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="m-0 text-xs font-bold tracking-wide text-brand uppercase">Your opinion</p>
              <h2 className="mt-1 mb-0 text-lg font-extrabold">Posted in the gallery</h2>
              <p className="mt-1 mb-0 text-sm text-slate-500">
                One opinion per account. Edit or delete it anytime.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={`${btnOutline} h-10 px-4`} onClick={startEdit}>
                Edit
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-[13px] font-bold text-slate-600 hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-300"
                onClick={() => {
                  const nextList = deleteOpinion(userId)
                  setMine(null)
                  setOpinion('')
                  setRating(5)
                  setEditing(true)
                  setSaved(false)
                  setError('')
                  onSaved?.(nextList)
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <DonorAvatar name={mine.name} photo={mine.photo} />
            <div className="min-w-0">
              <p className="m-0 font-extrabold">{mine.name}</p>
              <p className="mt-1 mb-0 text-sm text-slate-500">
                {mine.role}
                {mine.location ? ` · ${mine.location}` : ''}
              </p>
            </div>
          </div>
          <p className="mt-3 mb-0 text-amber-500" aria-label={`${mine.rating} out of 5 stars`}>
            {'★'.repeat(mine.rating)}
            <span className="text-slate-300 dark:text-slate-600">{'★'.repeat(5 - mine.rating)}</span>
          </p>
          <p className="mt-3 mb-0 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">“{mine.opinion}”</p>
          <p className="mt-4 mb-0 text-xs font-semibold tracking-wide text-slate-400 uppercase">
            {mine.updatedAt && mine.updatedAt !== mine.createdAt
              ? `Updated ${formatOpinionDate(mine.updatedAt)}`
              : formatOpinionDate(mine.createdAt)}
          </p>
          {saved ? (
            <p className="mt-3 mb-0 text-sm font-medium text-emerald-600">Your opinion was updated.</p>
          ) : null}
        </article>
      ) : null}

      {editing ? (
        <form className={`${cardClass} p-4 sm:p-6`} onSubmit={handleSubmit} noValidate>
          <h2 className="m-0 text-lg font-extrabold sm:text-xl">{mine ? 'Edit your opinion' : 'Share your opinion'}</h2>
          <p className="mt-1 mb-5 text-sm text-slate-500 dark:text-slate-400">
            One opinion per user, max {MAX_OPINION_CHARS} characters. Photo, name, address, and role come from your profile.
          </p>

          <div className="mb-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-zinc-50 p-3 dark:border-slate-700 dark:bg-panel-2">
            <DonorAvatar name={user.name} photo={user.photo} />
            <div className="min-w-0">
              <p className="m-0 font-extrabold">{user.name}</p>
              <p className="mt-1 mb-0 text-sm text-slate-500 dark:text-slate-400">
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
                    setError('')
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
              maxLength={MAX_OPINION_CHARS}
              placeholder="How did BloodConnector help you?"
              value={opinion}
              className={`${inputClass} h-auto min-h-28 py-3 ${error ? 'border-brand' : ''}`}
              onChange={(event) => {
                const value = event.target.value.slice(0, MAX_OPINION_CHARS)
                setOpinion(value)
                setSaved(false)
                setError('')
              }}
            />
            <span className={`mt-1.5 block text-xs font-medium ${opinion.length >= MAX_OPINION_CHARS ? 'text-brand' : 'text-slate-400'}`}>
              {opinion.length}/{MAX_OPINION_CHARS} characters
            </span>
          </label>

          {error ? <p className="mt-3 mb-0 text-sm font-medium text-brand" role="alert">{error}</p> : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="submit" className={`${btnPrimary} sm:w-auto sm:px-8`}>
              {mine ? 'Update & post' : 'Post opinion'}
            </button>
            {mine ? (
              <button
                type="button"
                className={`${btnOutline} h-12 px-4`}
                onClick={() => {
                  setEditing(false)
                  setError('')
                  setOpinion(mine.opinion)
                  setRating(mine.rating)
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      ) : null}
    </div>
  )
}
