import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import DonorAvatar from '../components/DonorAvatar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { readImageFile, roleLabel } from '../lib/user.js'
import { btnPrimary, cardClass } from '../lib/classes.js'

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'BloodConnector — Profile'
  }, [])

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  async function handlePhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      updateUser({ photo: await readImageFile(file) })
    } catch {
      /* keep current photo */
    }
  }

  return (
    <Layout>
      <section className="mx-auto w-[min(720px,calc(100%-24px))] py-6 sm:w-[min(720px,calc(100%-32px))] sm:py-10">
        <div className={`${cardClass} overflow-hidden`}>
          <div className="bg-brand px-5 pt-8 pb-14 text-center text-white sm:px-8 sm:pt-10 sm:pb-16">
            <DonorAvatar
              name={user.name}
              photo={user.photo}
              size="lg"
              className="mx-auto border-4 border-white"
            />
            <h1 className="mt-4 text-xl font-extrabold text-white sm:text-2xl">{user.name}</h1>
            <p className="mt-1 text-white/85">Verified BloodConnector {roleLabel(user.role).toLowerCase()}</p>
            <label className="mt-4 inline-flex h-10 cursor-pointer items-center rounded-lg border border-white/70 bg-white/10 px-4 text-sm font-bold text-white">
              Change photo
              <input type="file" accept="image/*" className="sr-only" onChange={handlePhoto} />
            </label>
          </div>

          <div className="-mt-8 grid grid-cols-1 gap-2 px-4 sm:grid-cols-3 sm:gap-3 sm:px-6">
            {[
              ['Role', roleLabel(user.role)],
              ['Requested', '0'],
              ['Blood Group', user.bloodGroup || '—'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-white p-3 text-center sm:p-4 dark:border-slate-700 dark:bg-panel-2">
                <p className="m-0 text-lg font-extrabold text-brand sm:text-xl">{value}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <dl className="space-y-4 px-5 py-6 sm:px-8 sm:py-8">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Full name</dt>
              <dd className="mt-1 m-0 text-base font-semibold">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Role</dt>
              <dd className="mt-1 m-0 text-base font-semibold">{roleLabel(user.role)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Address</dt>
              <dd className="mt-1 m-0 text-base font-semibold">{user.address || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Email or phone</dt>
              <dd className="mt-1 m-0 text-base font-semibold">{user.emailOrPhone || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Age</dt>
              <dd className="mt-1 m-0 text-base font-semibold">{user.age || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Blood group</dt>
              <dd className="mt-1 m-0 text-base font-semibold">{user.bloodGroup || '—'}</dd>
            </div>
          </dl>

          <div className="px-5 pb-6 sm:px-8 sm:pb-8">
            <button type="button" className={btnPrimary} onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </section>
    </Layout>
  )
}
