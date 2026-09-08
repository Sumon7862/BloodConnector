import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Donors from './pages/Donors.jsx'
import DonorHistory from './pages/DonorHistory.jsx'
import Doctors from './pages/Doctors.jsx'
import DoctorDetails from './pages/DoctorDetails.jsx'
import Gallery from './pages/Gallery.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Profile from './pages/Profile.jsx'

function GuestOnly({ children }) {
  const { isLoggedIn } = useAuth()
  if (isLoggedIn) return <Navigate to="/" replace />
  return children
}

function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-svh overflow-x-hidden bg-zinc-100 text-slate-900 dark:bg-ink dark:text-slate-100">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/donors" element={<Donors />} />
              <Route path="/donors/:id" element={<DonorHistory />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:id" element={<DoctorDetails />} />
              <Route path="/gallery" element={<Gallery />} />
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
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
