import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Donors from './pages/Donors.jsx'
import DonorHistory from './pages/DonorHistory.jsx'
import Doctors from './pages/Doctors.jsx'
import DoctorDetails from './pages/DoctorDetails.jsx'
import BloodRequests from './pages/BloodRequests.jsx'
import Gallery from './pages/Gallery.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Profile from './pages/Profile.jsx'
import DashboardHome from './pages/dashboard/DashboardHome.jsx'
import RequestBlood from './pages/dashboard/RequestBlood.jsx'
import MyDonations from './pages/dashboard/MyDonations.jsx'
import DashboardGallery from './pages/dashboard/DashboardGallery.jsx'
import BloodTypes from './pages/dashboard/BloodTypes.jsx'
import Consultation from './pages/dashboard/Consultation.jsx'
import DashboardProfile from './pages/dashboard/Profile.jsx'
import FamilyDonors from './pages/dashboard/FamilyDonors.jsx'
import OpenRequests from './pages/dashboard/OpenRequests.jsx'
import Notifications from './pages/dashboard/Notifications.jsx'
import SettingsPage from './pages/dashboard/Settings.jsx'
import { homePath } from './lib/user.js'

function GuestOnly({ children }) {
  const { isLoggedIn, ready, user } = useAuth()
  if (!ready) return null
  if (isLoggedIn) return <Navigate to={homePath(user)} replace />
  return children
}

function RequireAuth({ children }) {
  const { isLoggedIn, ready } = useAuth()
  const location = useLocation()
  if (!ready) return null
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

function AppRoutes() {
  return (
    <div className="min-h-svh overflow-x-hidden bg-zinc-50 text-slate-900 dark:bg-ink dark:text-slate-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/donors" element={<Donors />} />
        <Route path="/donors/:id" element={<DonorHistory />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/requests" element={<BloodRequests />} />
        <Route
          path="/login"
          element={
            <GuestOnly>
              <Login />
            </GuestOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestOnly>
              <SignUp />
            </GuestOnly>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="people" element={<FamilyDonors />} />
          <Route path="request-blood" element={<RequestBlood />} />
          <Route path="open-requests" element={<OpenRequests />} />
          <Route path="donations" element={<MyDonations />} />
          <Route path="gallery" element={<DashboardGallery />} />
          <Route path="blood-types" element={<BloodTypes />} />
          <Route path="consultation" element={<Consultation />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
