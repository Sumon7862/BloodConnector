import { useCallback, useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import Screen from '../components/Screen'
import Field from '../components/Field'
import Button from '../components/Button'
import Card from '../components/Card'
import Avatar from '../components/Avatar'
import Chip from '../components/Chip'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../hooks/useAuth'
import { deleteOpinion, findUserOpinion, loadOpinions, saveOpinion } from '../services/opinionService'
import { validateOpinion, validateRating } from '../utils/validation'
import type { Opinion } from '../types'
import { useTheme } from '../hooks/useTheme'

export default function GalleryScreen() {
  const { isLoggedIn } = useAuth()
  const { colors } = useTheme()
  const router = useRouter()
  const [opinions, setOpinions] = useState<Opinion[]>([])
  const [mine, setMine] = useState<Opinion | null>(null)
  const [opinion, setOpinion] = useState('')
  const [rating, setRating] = useState(5)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const list = await loadOpinions()
    setOpinions(list)
    if (isLoggedIn) {
      const current = await findUserOpinion()
      setMine(current)
      setOpinion(current?.opinion || '')
      setRating(current?.rating || 5)
    }
    setLoading(false)
  }, [isLoggedIn])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function submit() {
    const nextError = validateRating(rating) || validateOpinion(opinion)
    if (nextError) {
      setError(nextError)
      return
    }
    try {
      const list = await saveOpinion(opinion.trim(), rating)
      setOpinions(list)
      setMine(await findUserOpinion())
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your opinion.')
    }
  }

  return (
    <Screen loading={loading}>
      <Text style={[styles.title, { color: colors.text }]}>Community gallery</Text>
      <Text style={[styles.copy, { color: colors.muted }]}>Patients and donors share short notes here. One opinion per member.</Text>

      {isLoggedIn ? (
        <Card style={{ marginBottom: 16 }}>
          <Text style={[styles.section, { color: colors.text }]}>{mine ? 'Your opinion' : 'Share your opinion'}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Rating</Text>
          <View style={styles.wrap}>
            {[1, 2, 3, 4, 5].map((value) => (
              <Chip key={value} label={`${value}`} selected={rating === value} onPress={() => setRating(value)} />
            ))}
          </View>
          <Field
            label="Opinion"
            value={opinion}
            onChangeText={(value) => { setOpinion(value); setError('') }}
            multiline
            maxLength={100}
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />
          {error ? <Text style={[styles.error, { color: colors.brand }]}>{error}</Text> : null}
          <Button title={mine ? 'Update opinion' : 'Post opinion'} onPress={submit} />
          {mine ? (
            <View style={{ marginTop: 8 }}>
              <Button
                title="Delete"
                variant="outline"
                onPress={() => {
                  Alert.alert('Delete your opinion?', 'This removes it from the gallery.', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        const list = await deleteOpinion()
                        setOpinions(list)
                        setMine(null)
                        setOpinion('')
                      },
                    },
                  ])
                }}
              />
            </View>
          ) : null}
        </Card>
      ) : (
        <EmptyState title="Login to share your opinion" body="Name, photo, and blood group come from your profile." action="Login" onAction={() => router.push('/login')} />
      )}

      <Text style={[styles.section, { color: colors.text }]}>Community voices</Text>
      {opinions.length ? opinions.map((item) => (
        <Card key={item.id} style={{ marginBottom: 10 }}>
          <View style={styles.row}>
            <Avatar name={item.name} photo={item.photo} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.meta, { color: colors.muted }]}>{item.role}{item.location ? ` · ${item.location}` : ''}</Text>
            </View>
            {item.rating ? <Text style={[styles.rating, { color: colors.brand }]}>{item.rating}/5</Text> : null}
          </View>
          <Text style={[styles.body, { color: colors.text }]}>{item.opinion}</Text>
        </Card>
      )) : <EmptyState title="No stories yet" />}
    </Screen>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800' },
  copy: { marginTop: 6, marginBottom: 16, lineHeight: 20 },
  section: { fontWeight: '800', fontSize: 16, marginBottom: 12, marginTop: 8 },
  label: { fontWeight: '700', marginBottom: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  error: { marginBottom: 12, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  name: { fontWeight: '800' },
  meta: { marginTop: 2 },
  rating: { fontWeight: '800' },
  body: { marginTop: 12, lineHeight: 20 },
})
