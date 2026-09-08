import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import AdminLayout from './pages/AdminLayout.jsx'
import Login from './pages/Login.jsx'
import AdminHome from './pages/AdminHome.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import AdminRequests from './pages/AdminRequests.jsx'
import AdminDonors from './pages/AdminDonors.jsx'
import AdminDoctors from './pages/AdminDoctors.jsx'
import AdminBanks from './pages/AdminBanks.jsx'
import AdminOpinions from './pages/AdminOpinions.jsx'

function GuestOnly({ children }) {
  const { isLoggedIn, ready } = useAuth()
  if (!ready) return null
  if (isLoggedIn) return <Navigate to="/" replace />
  return children
}

function RequireAdmin({ children }) {
  const { isLoggedIn, ready } = useAuth()
  const location = useLocation()
  if (!ready) return null
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />
      <Route
        path="/"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="donors" element={<AdminDonors />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="banks" element={<AdminBanks />} />
        <Route path="opinions" element={<AdminOpinions />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
