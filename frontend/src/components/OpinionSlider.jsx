import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DonorAvatar from './DonorAvatar.jsx'
import { formatOpinionDate, loadOpinions, OPINIONS_EVENT } from '../data/gallery.js'
import { cardClass } from '../lib/classes.js'

function usePerView() {
  const [perView, setPerView] = useState(1)

  useEffect(() => {
    function update() {
      if (window.matchMedia('(min-width: 1280px)').matches) setPerView(3)
      else if (window.matchMedia('(min-width: 640px)').matches) setPerView(2)
      else setPerView(1)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return perView
}

export default function OpinionSlider() {
  const [opinions, setOpinions] = useState([])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const perView = usePerView()
  const maxIndex = Math.max(0, opinions.length - perView)

  useEffect(() => {
    let cancelled = false
    function refresh() {
      loadOpinions().then((list) => { if (!cancelled) setOpinions(list) })
    }
    refresh()
    window.addEventListener(OPINIONS_EVENT, refresh)
    return () => {
      cancelled = true
      window.removeEventListener(OPINIONS_EVENT, refresh)
    }
  }, [])

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex))
  }, [maxIndex])

  useEffect(() => {
    if (paused || maxIndex === 0) return undefined
    const timer = window.setInterval(() => {
      setIndex((current) => (current >= maxIndex ? 0 : current + 1))
    }, 5200)
    return () => window.clearInterval(timer)
  }, [paused, maxIndex])

  if (!opinions.length) return null

  const width = 100 / perView

  return (
    <section
      className="mx-auto w-[min(1180px,calc(100%-24px))] pt-12 pb-6 sm:w-[min(1180px,calc(100%-32px))] sm:pt-16"
      id="opinions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <header className="mb-7 flex flex-col items-center text-center sm:mb-8">
        <h2 className="m-0 text-[clamp(24px,3vw,32px)] font-extrabold tracking-tight">What our community says</h2>
        <p className="mt-2 mb-0 max-w-2xl text-slate-500 dark:text-slate-400">
          Notes from patients, donors, and doctors after they help each other.
        </p>
      </header>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * width}%)` }}
          >
            {opinions.map((item) => (
              <article key={item.id} className="shrink-0 px-2" style={{ width: `${width}%` }}>
                <div className={`${cardClass} flex h-full flex-col p-5`}>
                  <div className="flex items-start gap-3">
                    <DonorAvatar name={item.name} photo={item.photo} />
                    <div className="min-w-0">
                      <h3 className="m-0 truncate text-base font-extrabold">{item.name}</h3>
                      <p className="mt-1 mb-0 text-sm text-slate-500 dark:text-slate-400">
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
                </div>
              </article>
            ))}
          </div>
        </div>

        {maxIndex > 0 ? (
          <>
            <button
              type="button"
              className="absolute top-1/2 left-0 z-10 grid h-10 w-10 -translate-x-1 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-navy shadow-md sm:-translate-x-3 dark:border-slate-600 dark:bg-panel dark:text-white"
              aria-label="Previous opinions"
              onClick={() => setIndex((current) => (current <= 0 ? maxIndex : current - 1))}
            >
              ‹
            </button>
            <button
              type="button"
              className="absolute top-1/2 right-0 z-10 grid h-10 w-10 translate-x-1 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-navy shadow-md sm:translate-x-3 dark:border-slate-600 dark:bg-panel dark:text-white"
              aria-label="Next opinions"
              onClick={() => setIndex((current) => (current >= maxIndex ? 0 : current + 1))}
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {maxIndex > 0 ? (
        <div className="mt-5 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }, (_, dot) => (
            <button
              key={dot}
              type="button"
              className={`h-2.5 rounded-full transition-all ${dot === index ? 'w-7 bg-brand' : 'w-2.5 bg-slate-300 dark:bg-slate-600'}`}
              aria-label={`Show opinions ${dot + 1}`}
              onClick={() => setIndex(dot)}
            />
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex justify-center">
        <Link to="/gallery" className="text-sm font-extrabold text-brand no-underline hover:underline">
          See the gallery
        </Link>
      </div>
    </section>
  )
}
