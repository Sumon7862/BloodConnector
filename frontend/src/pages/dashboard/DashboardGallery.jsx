import { useEffect, useState } from 'react'
import DashPageHead from '../../components/DashPageHead.jsx'
import OpinionEditor from '../../components/OpinionEditor.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { loadOpinions } from '../../data/gallery.js'
import { dashInput } from '../../lib/classes.js'

export default function DashboardGallery() {
  const { user } = useAuth()
  const [, setOpinions] = useState(() => loadOpinions())

  useEffect(() => {
    document.title = 'BloodConnector — My Opinion'
  }, [])

  return (
    <div>
      <DashPageHead
        title="My Opinion"
        subtitle="Your opinion stays on the dashboard. Share one, then edit, update, or delete it anytime."
      />
      <OpinionEditor user={user} inputClass={dashInput} onSaved={setOpinions} />
    </div>
  )
}
