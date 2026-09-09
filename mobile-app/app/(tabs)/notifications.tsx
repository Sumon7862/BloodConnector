import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import Screen from '../../components/Screen'
import EmptyState from '../../components/EmptyState'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { useAuth } from '../../hooks/useAuth'
import { loadNotifications, saveNotifications } from '../../services/notificationService'
import type { AppNotification } from '../../types'
import { useTheme } from '../../hooks/useTheme'

export default function NotificationsScreen() {
  const { isLoggedIn } = useAuth()
  const { colors } = useTheme()
  const router = useRouter()
  const [notes, setNotes] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isLoggedIn) {
      setLoading(false)
      return
    }
    setNotes(await loadNotifications())
    setLoading(false)
  }, [isLoggedIn])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function markRead() {
    const next = notes.map((item) => ({ ...item, unread: false }))
    setNotes(next)
    await saveNotifications(next).catch(() => {})
  }

  if (!isLoggedIn) {
    return (
      <Screen>
        <EmptyState title="Login to see alerts" body="Matching requests and donor replies land here." action="Login" onAction={() => router.push('/login')} />
      </Screen>
    )
  }

  return (
    <Screen loading={loading}>
      <View style={styles.head}>
          <Text style={[styles.title, { color: colors.text }]}>Alerts</Text>
        {notes.length ? <Button title="Mark read" variant="outline" onPress={markRead} /> : null}
      </View>
      {notes.length ? notes.map((note) => (
        <Card key={note.id} style={{ marginBottom: 10 }}>
          <Text style={[styles.noteTitle, { color: colors.text }]}>{note.title}</Text>
          <Text style={[styles.body, { color: colors.muted }]}>{note.message}</Text>
          {note.unread ? <Text style={[styles.unread, { color: colors.brand }]}>New</Text> : null}
        </Card>
      )) : <EmptyState title="No notifications yet" />}
    </Screen>
  )
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: '800', flex: 1 },
  noteTitle: { fontWeight: '800' },
  body: { marginTop: 4 },
  unread: { marginTop: 8, fontWeight: '800', fontSize: 12 },
})
