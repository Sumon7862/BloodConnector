import { useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import Screen from '../components/Screen'
import Field from '../components/Field'
import Button from '../components/Button'
import Chip from '../components/Chip'
import RequestCard from '../components/RequestCard'
import EmptyState from '../components/EmptyState'
import AuthGate from '../components/AuthGate'
import { useAuth } from '../hooks/useAuth'
import { useRequests } from '../hooks/useRequests'
import { createBloodRequest } from '../services/bloodRequestService'
import { BLOOD_GROUPS, URGENCY } from '../constants/blood'
import { sortRequests, userIdFrom } from '../utils/requests'
import { validatePhone, validateRequired } from '../utils/validation'
import { useTheme } from '../hooks/useTheme'

function RequestBloodForm() {
  const { user } = useAuth()
  const { colors } = useTheme()
  const router = useRouter()
  const { requests, refresh } = useRequests()
  const [form, setForm] = useState({
    bloodType: '',
    urgency: '',
    location: user?.address || '',
    contact: user?.phone || user?.emailOrPhone || '',
    details: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const myId = userIdFrom(user)
  const mine = useMemo(
    () => sortRequests(requests.filter((item) => item.requesterId === myId)),
    [requests, myId],
  )

  function setField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
    setSaved(false)
    setFormError('')
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  async function submit() {
    const next = {
      bloodType: validateRequired(form.bloodType, 'Please select the required blood type.'),
      urgency: validateRequired(form.urgency, 'Please select an urgency level.'),
      location: validateRequired(form.location, 'Location is required.')
        || (form.location.trim().length < 3 ? 'Enter a valid hospital or area name.' : ''),
      contact: validatePhone(form.contact),
      details: validateRequired(form.details, 'Please add additional details.'),
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) {
      setFormError('Please complete all required fields.')
      return
    }
    setSubmitting(true)
    try {
      await createBloodRequest(form)
      setSaved(true)
      setFormError('')
      setForm({
        bloodType: '',
        urgency: '',
        location: user?.address || '',
        contact: user?.phone || user?.emailOrPhone || '',
        details: '',
      })
      await refresh()
    } catch (error) {
      setSaved(false)
      setFormError(error instanceof Error ? error.message : 'Could not submit that request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Request blood</Text>
      <Text style={[styles.copy, { color: colors.muted }]}>Matching donors see this on their Requests tab and can call you.</Text>
      <Text style={[styles.label, { color: colors.text }]}>Blood type needed</Text>
      <View style={styles.wrap}>
        {BLOOD_GROUPS.map((type) => (
          <Chip key={type} label={type} selected={form.bloodType === type} onPress={() => setField('bloodType', type)} />
        ))}
      </View>
      {errors.bloodType ? <Text style={[styles.error, { color: colors.brand }]}>{errors.bloodType}</Text> : null}
      <Text style={[styles.label, { color: colors.text }]}>Urgency</Text>
      <View style={styles.wrap}>
        {URGENCY.map((level) => (
          <Chip key={level} label={level} selected={form.urgency === level} onPress={() => setField('urgency', level)} />
        ))}
      </View>
      {errors.urgency ? <Text style={[styles.error, { color: colors.brand }]}>{errors.urgency}</Text> : null}
      <Field label="Hospital / area" value={form.location} onChangeText={(value) => setField('location', value)} error={errors.location} />
      <Field label="Contact phone" value={form.contact} onChangeText={(value) => setField('contact', value)} keyboardType="phone-pad" error={errors.contact} />
      <Field label="Details" value={form.details} onChangeText={(value) => setField('details', value)} multiline error={errors.details} style={{ minHeight: 90, textAlignVertical: 'top' }} />
      {formError ? <Text style={[styles.error, { color: colors.brand }]}>{formError}</Text> : null}
      {saved ? <Text style={[styles.ok, { color: colors.success }]}>Request posted. Matching donors can now see it.</Text> : null}
      <Button title="Post request" onPress={submit} loading={submitting} />

      <Text style={[styles.section, { color: colors.text }]}>Your requests</Text>
      {mine.length ? mine.map((item) => (
        <View key={item.id} style={{ marginBottom: 12 }}>
          <RequestCard request={item} mode="owner" onChanged={refresh} />
        </View>
      )) : <EmptyState title="No requests yet" body="Your open and filled requests will appear here." />}
      <View style={{ height: 12 }} />
      <Button title="See matching inbox" variant="outline" onPress={() => router.push('/(tabs)/requests')} />
    </Screen>
  )
}

export default function RequestBloodScreen() {
  return (
    <AuthGate>
      <RequestBloodForm />
    </AuthGate>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800' },
  copy: { marginTop: 6, marginBottom: 16, lineHeight: 20 },
  label: { fontWeight: '700', marginBottom: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  error: { marginBottom: 12, fontWeight: '600' },
  ok: { fontWeight: '700', marginBottom: 12 },
  section: { marginTop: 24, marginBottom: 12, fontWeight: '800', fontSize: 16 },
})
