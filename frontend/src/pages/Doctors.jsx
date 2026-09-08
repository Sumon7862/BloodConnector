import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import PageHero from '../components/PageHero.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { DOCTOR_HERO_COPY, fetchDoctors } from '../data/doctors.js'
import { pageWidth } from '../lib/classes.js'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    document.title = 'BloodConnector — Doctors'
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchDoctors().then((list) => { if (!cancelled) setDoctors(list) })
    return () => { cancelled = true }
  }, [])

  return (
    <Layout>
      <PageHero eyebrow="Doctors" title="Free care for donors and patients">
        {DOCTOR_HERO_COPY}
      </PageHero>

      <section className={`${pageWidth} py-10 sm:py-14`}>
        <SectionHeader
          title="Volunteer physicians"
          subtitle="Call for eligibility, recovery, or emergency advice while a blood match is underway."
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </section>
    </Layout>
  )
}
