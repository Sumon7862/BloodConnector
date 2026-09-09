import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../hooks/useAuth'
import Screen from './Screen'

export default function AuthGate({ children }: { children: ReactNode }) {
  const { isLoggedIn, ready } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (ready && !isLoggedIn) router.replace('/login')
  }, [ready, isLoggedIn, router])

  if (!ready || !isLoggedIn) return <Screen loading />
  return <>{children}</>
}
