import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import NetworkRoles from '../components/NetworkRoles.jsx'
import {
  ABOUT_HERO,
  ABOUT_MISSION,
  ABOUT_VISION,
  WHAT_WE_DO,
  WHY_CHOOSE_US,
} from '../data/aboutData.js'
import { btnOutline, cardClass, pageWidth } from '../lib/classes.js'

export default function About() {
  useEffect(() => {
    document.title = 'BloodConnector — About the blood donor network'
  }, [])

  return (
    <Layout>
      <PageHero eyebrow="About" title="A network, not just a directory">
        {ABOUT_HERO}
      </PageHero>

      <div className={`${pageWidth} space-y-16 py-12 sm:py-16`}>
        <section>
          <SectionHeader align="left" eyebrow="Mission" title="No patient waits alone" subtitle={ABOUT_MISSION} />
        </section>

        <section>
          <SectionHeader align="left" eyebrow="Vision" title="Help within one search" subtitle={ABOUT_VISION} />
        </section>

        <section>
          <SectionHeader eyebrow="How we connect" title="Request blood. Donate blood." />
          <NetworkRoles />
        </section>

        <section>
          <SectionHeader eyebrow="What we do" title="Practical help, not extra noise" />
          <div className="grid gap-4 sm:grid-cols-2">
            {WHAT_WE_DO.map((item) => (
              <article key={item.title} className={`${cardClass} p-5`}>
                <h3 className="m-0 text-base font-extrabold">{item.title}</h3>
                <p className="mt-2 mb-0 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Why BloodConnector" title="Built for trust in a crisis" />
          <div className="grid gap-4 sm:grid-cols-2">
            {WHY_CHOOSE_US.map((item) => (
              <article key={item.title} className={`${cardClass} p-5`}>
                <h3 className="m-0 text-base font-extrabold">{item.title}</h3>
                <p className="mt-2 mb-0 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/donors" className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 font-extrabold text-white no-underline hover:bg-brand-hover">
            Find a donor
          </Link>
          <Link to="/requests" className={`${btnOutline} h-11 px-6 no-underline`}>
            See requests
          </Link>
        </div>
      </div>
    </Layout>
  )
}
