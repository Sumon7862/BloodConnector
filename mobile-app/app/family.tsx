import { useEffect, useState } from 'react'
import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import Screen from '../components/Screen'
import Field from '../components/Field'
import Button from '../components/Button'
import Chip from '../components/Chip'
import Card from '../components/Card'
import Avatar from '../components/Avatar'
import BloodBadge from '../components/BloodBadge'
import EmptyState from '../components/EmptyState'
import AuthGate from '../components/AuthGate'
import { BLOOD_GROUPS } from '../constants/blood'
import {
  loadFamily,
  loadFriends,
  removeFriend,
  saveFamily,
  type Person,
} from '../services/peopleService'
import { validateEmail, validateFullName, validatePhone, validateRequired } from '../utils/validation'
import { useTheme } from '../hooks/useTheme'

function FamilyForm() {
  const router = useRouter()
  const { colors } = useTheme()
  const [friends, setFriends] = useState<Person[]>([])
  const [family, setFamily] = useState<Person[]>([])
  const [member, setMember] = useState({ name: '', bloodType: 'O+', relation: '', email: '', phone: '' })
  const [memberError, setMemberError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([loadFriends(), loadFamily()]).then(([nextFriends, nextFamily]) => {
      setFriends(nextFriends)
      setFamily(nextFamily)
      setLoading(false)
    })
  }, [])

  async function persistFamily(next: Person[]) {
    setFamily(next)
    try {
      await saveFamily(next)
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : 'Try again.')
    }
  }

  async function addMember() {
    const nextError =
      validateFullName(member.name) ||
      validateRequired(member.relation, 'Please enter the relationship.') ||
      (member.phone.trim() ? validatePhone(member.phone) : '') ||
      (member.email.trim() ? validateEmail(member.email) : '')
    if (nextError) {
      setMemberError(nextError)
      return
    }
    await persistFamily([
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...member,
        name: member.name.trim(),
      },
      ...family,
    ])
    setMember({ name: '', bloodType: 'O+', relation: '', email: '', phone: '' })
    setMemberError('')
  }

  return (
    <Screen loading={loading}>
      <Text style={[styles.title, { color: colors.text }]}>Family & donors</Text>
      <Text style={[styles.copy, { color: colors.muted }]}>Keep people you may need to reach in a crisis. Added directory donors appear here too.</Text>

      <Text style={[styles.section, { color: colors.text }]}>Saved donors</Text>
      {friends.length ? friends.map((person) => (
        <Card key={person.id} style={{ marginBottom: 10 }}>
          <View style={styles.row}>
            <Avatar name={person.name} photo={person.photo} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.text }]}>{person.name}</Text>
              <Text style={[styles.meta, { color: colors.muted }]}>{person.location || person.relation || 'Saved donor'}</Text>
            </View>
            <BloodBadge type={person.bloodType} />
          </View>
          <View style={styles.actions}>
            {person.phone ? (
              <View style={{ flex: 1 }}>
                <Button title="Call" variant="outline" onPress={() => Linking.openURL(`tel:${person.phone}`)} />
              </View>
            ) : null}
            <View style={{ flex: 1 }}>
              <Button
                title="Remove"
                variant="outline"
                onPress={() => {
                  removeFriend(person.id).then(setFriends).catch((error) => {
                    Alert.alert('Could not remove', error instanceof Error ? error.message : 'Try again.')
                  })
                }}
              />
            </View>
          </View>
        </Card>
      )) : (
        <EmptyState title="No saved donors yet" body="Open a donor card and tap Add donor." action="Find donors" onAction={() => router.push('/(tabs)/donors')} />
      )}

      <Text style={[styles.section, { color: colors.text }]}>Family</Text>
      {family.map((person) => (
        <Card key={person.id} style={{ marginBottom: 10 }}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.text }]}>{person.name}</Text>
              <Text style={[styles.meta, { color: colors.muted }]}>{person.relation}{person.phone ? ` · ${person.phone}` : ''}</Text>
            </View>
            <BloodBadge type={person.bloodType} />
          </View>
          <Button title="Remove" variant="outline" onPress={() => persistFamily(family.filter((item) => item.id !== person.id))} />
        </Card>
      ))}

      <Text style={[styles.section, { color: colors.text }]}>Add a family member</Text>
      <Field label="Name" value={member.name} onChangeText={(value) => setMember((c) => ({ ...c, name: value }))} />
      <Field label="Relationship" value={member.relation} onChangeText={(value) => setMember((c) => ({ ...c, relation: value }))} placeholder="Parent, sibling..." />
      <Text style={[styles.label, { color: colors.text }]}>Blood group</Text>
      <View style={styles.wrap}>
        {BLOOD_GROUPS.map((type) => (
          <Chip key={type} label={type} selected={member.bloodType === type} onPress={() => setMember((c) => ({ ...c, bloodType: type }))} />
        ))}
      </View>
      <Field label="Phone (optional)" value={member.phone} onChangeText={(value) => setMember((c) => ({ ...c, phone: value }))} keyboardType="phone-pad" />
      <Field label="Email (optional)" value={member.email} onChangeText={(value) => setMember((c) => ({ ...c, email: value }))} autoCapitalize="none" />
      {memberError ? <Text style={[styles.error, { color: colors.brand }]}>{memberError}</Text> : null}
      <Button title="Save family member" onPress={addMember} />
    </Screen>
  )
}

export default function FamilyScreen() {
  return (
    <AuthGate>
      <FamilyForm />
    </AuthGate>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800' },
  copy: { marginTop: 6, marginBottom: 16, lineHeight: 20 },
  section: { marginTop: 16, marginBottom: 12, fontWeight: '800', fontSize: 16 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  name: { fontWeight: '800' },
  meta: { marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  label: { fontWeight: '700', marginBottom: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  error: { marginBottom: 12, fontWeight: '600' },
})
