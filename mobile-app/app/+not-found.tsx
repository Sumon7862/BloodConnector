import { useRouter } from 'expo-router'
import Screen from '../components/Screen'
import EmptyState from '../components/EmptyState'

export default function NotFoundScreen() {
  const router = useRouter()
  return (
    <Screen>
      <EmptyState title="Page not found" body="That screen is not in BloodConnector." action="Go home" onAction={() => router.replace('/(tabs)')} />
    </Screen>
  )
}
