import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import type { Donor } from '../types'
import { useAuth } from '../hooks/useAuth'
import { addFriend, loadFriends, removeFriend, toDirectoryPerson } from '../services/peopleService'
import { remainingParts } from '../utils/eligibility'
import Avatar from './Avatar'
import BloodBadge from './BloodBadge'
import Button from './Button'
import Card from './Card'
import { useTheme } from '../hooks/useTheme'

export default function DonorCard({ donor }: { donor: Donor }) {
  const { isLoggedIn } = useAuth()
  const { colors, isDark } = useTheme()
  const router = useRouter()
  const person = useMemo(() => toDirectoryPerson(donor), [donor])
  const [added, setAdded] = useState(false)
  const until = donor.nextEligibleAt
  const avail = remainingParts(until)

  useEffect(() => {
    if (!isLoggedIn) return
    loadFriends().then((list) => setAdded(list.some((item) => item.id === person.id)))
  }, [isLoggedIn, person.id])

  async function toggleAdd() {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    try {
      if (added) {
        await removeFriend(person.id)
        setAdded(false)
      } else {
        await addFriend(person)
        setAdded(true)
      }
    } catch (error) {
      Alert.alert('Could not update', error instanceof Error ? error.message : 'Try again.')
    }
  }

  return (
    <Card>
      <View style={styles.top}>
        <Avatar name={donor.name} photo={donor.photo} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{donor.name}</Text>
          <Text style={[styles.meta, { color: colors.muted }]} numberOfLines={1}>{donor.location || donor.area || 'Location not listed'}</Text>
        </View>
        <BloodBadge type={donor.bloodType} />
      </View>
      <Text style={[styles.status, { color: avail.done ? colors.success : colors.muted }]}>{avail.label}</Text>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Button title="Call" variant="outline" disabled={!donor.phone} onPress={() => donor.phone && Linking.openURL(`tel:${donor.phone}`)} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="History" variant="outline" onPress={() => router.push(`/donor/${donor.id}`)} />
        </View>
      </View>
      <Pressable onPress={toggleAdd} style={[styles.add, { backgroundColor: colors.brand }, added && { backgroundColor: isDark ? '#3f1218' : '#fff1f2', borderWidth: 1, borderColor: colors.brand }]}>
        <Text style={[styles.addText, added && { color: colors.brand }]}>
          {isLoggedIn ? (added ? 'Added · Remove' : 'Add donor') : 'Login to add'}
        </Text>
      </Pressable>
    </Card>
  )
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  name: { fontWeight: '800', fontSize: 16 },
  meta: { marginTop: 2 },
  status: { marginVertical: 12, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8 },
  add: { marginTop: 10, borderRadius: 12, minHeight: 46, alignItems: 'center', justifyContent: 'center' },
  addText: { color: '#fff', fontWeight: '800' },
})
