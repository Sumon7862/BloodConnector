import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import PageHero from '../components/PageHero.jsx'
import { addDoctorReview, fetchDoctor, getDoctorReviews } from '../data/doctors.js'
import { btnPrimary, cardClass, inputClass } from '../lib/classes.js'

export default function DoctorDetails() {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [missing, setMissing] = useState(false)
  const [reviews, setReviews] = useState([])
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchDoctor(id).then((next) => {
      if (cancelled) return
      if (!next) {
        setMissing(true)
        return
      }
      setDoctor(next)
      document.title = `BloodConnector — ${next.name}`
      getDoctorReviews(next.id).then((list) => {
        if (!cancelled) setReviews(list)
      })
      setName('')
      setComment('')
      setError('')
    })
    return () => {
      cancelled = true
    }
  }, [id])

  if (missing) return <Navigate to="/doctors" replace />
  if (!doctor) return null

  async function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim() || !comment.trim()) {
      setError('Please enter your name and comment.')
      return
    }
    try {
      const next = await addDoctorReview(doctor.id, {
        name: name.trim(),
        comment: comment.trim(),
      })
      setReviews(next)
      setName('')
      setComment('')
      setError('')
    } catch (err) {
      setError(err.message || 'Could not submit that review.')
    }
  }

  return (
    <Layout>
      <PageHero eyebrow="Doctors" title={doctor.name}>
        Volunteer care for patients waiting on blood and donors preparing to give.
      </PageHero>

      <section className="mx-auto w-[min(760px,calc(100%-24px))] py-8 sm:w-[min(760px,calc(100%-32px))] sm:py-12">
        <article className={`${cardClass} px-5 py-8 text-center sm:px-10 sm:py-10`}>
          <img
            src={doctor.photo}
            alt=""
            className="mx-auto h-[220px] w-[220px] rounded-xl object-cover sm:h-[260px] sm:w-[260px]"
          />
          <h1 className="mt-6 m-0 text-2xl font-extrabold sm:text-[28px]">{doctor.name}</h1>
          <p className="mt-3 mb-0 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
            {doctor.qualifications}
          </p>
          <p className="mt-4 mb-0 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
            <strong className="font-extrabold text-slate-900 dark:text-slate-100">Specialization :</strong>{' '}
            {doctor.specialization}
          </p>
          <p className="mt-3 mb-0 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
            <strong className="font-extrabold text-slate-900 dark:text-slate-100">Hospital :</strong>{' '}
            {doctor.hospital}
          </p>
          <a
            href={`tel:${doctor.phone}`}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-brand px-6 font-bold text-white no-underline hover:bg-brand-hover"
          >
            Call Doctor
          </a>

          <div className="mt-8 border-t border-slate-200 pt-6 text-left dark:border-slate-700">
            <h2 className="m-0 text-lg font-extrabold">Patient Review</h2>
            {reviews.length ? (
              <ul className="mt-4 mb-5 list-none space-y-3 p-0">
                {reviews.map((review) => (
                  <li key={review.id} className="rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700">
                    <p className="m-0 text-sm font-bold">{review.name}</p>
                    <p className="mt-1 mb-0 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{review.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 mb-5 text-sm font-medium text-teal-600 dark:text-teal-400">
                No reviews yet. Be the first to share your experience!
              </p>
            )}

            <form className="space-y-3" onSubmit={handleSubmit} noValidate>
              <label className="sr-only" htmlFor="review-name">Your name</label>
              <input
                id="review-name"
                type="text"
                placeholder="Enter Your Name"
                value={name}
                className={inputClass}
                onChange={(event) => setName(event.target.value)}
              />
              <label className="sr-only" htmlFor="review-comment">Your comment</label>
              <textarea
                id="review-comment"
                rows="4"
                placeholder="Write Your Comment"
                value={comment}
                className={`${inputClass} h-auto min-h-24 py-3`}
                onChange={(event) => setComment(event.target.value)}
              />
              {error ? <p className="m-0 text-sm font-medium text-brand">{error}</p> : null}
              <button type="submit" className={btnPrimary}>
                Submit Review
              </button>
            </form>
          </div>
        </article>

        <div className="mt-8 flex justify-center">
          <Link
            to="/doctors"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 px-6 text-sm font-bold text-slate-700 no-underline hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-200"
          >
            Back to Doctors
          </Link>
        </div>
      </section>
    </Layout>
  )
}
