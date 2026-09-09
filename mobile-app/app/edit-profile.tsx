import { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import Screen from '../components/Screen'
import Field from '../components/Field'
import Button from '../components/Button'
import Chip from '../components/Chip'
import Avatar from '../components/Avatar'
import AuthGate from '../components/AuthGate'
import { useAuth } from '../hooks/useAuth'
import { BLOOD_GROUPS } from '../constants/blood'
import { pickProfilePhoto } from '../utils/pickImage'
import { markDonatedNow } from '../utils/eligibility'
import {
  validateAddress,
  validateAge,
  validateBloodGroup,
  validateEmail,
  validateFullName,
  validatePhone,
} from '../utils/validation'
import { useTheme } from '../hooks/useTheme'

function EditProfileForm() {
  const { user, updateUser } = useAuth()
  const { colors } = useTheme()
  const extraPhones = user?.phones || []
  const raw = String(user?.emailOrPhone || '')
  const isEmail = raw.includes('@')
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || (isEmail ? raw : ''),
    phone: user?.phone || (!isEmail ? raw : ''),
    bloodGroup: user?.bloodGroup || '',
    address: user?.address || '',
    age: user?.age || '',
    weight: user?.weight || '',
    emergencyContact: user?.emergencyContact || '',
    medicalConditions: user?.medicalConditions || '',
    photo: user?.photo || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newPhone, setNewPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    const login = String(user.emailOrPhone || '')
    const loginIsEmail = login.includes('@')
    setForm({
      name: user.name || '',
      email: user.email || (loginIsEmail ? login : ''),
      phone: user.phone || (!loginIsEmail ? login : ''),
      bloodGroup: user.bloodGroup || '',
      address: user.address || '',
      age: user.age || '',
      weight: user.weight || '',
      emergencyContact: user.emergencyContact || '',
      medicalConditions: user.medicalConditions || '',
      photo: user.photo || '',
    })
  }, [user])

  function setField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
    setSaved(false)
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  async function save() {
    const next = {
      name: validateFullName(form.name),
      address: validateAddress(form.address),
      email: form.email.trim() ? validateEmail(form.email) : '',
      phone: validatePhone(form.phone, !form.email.trim() && extraPhones.length === 0),
      bloodGroup: validateBloodGroup(form.bloodGroup),
      age: validateAge(form.age),
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return
    setSaving(true)
    try {
      await updateUser({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        emailOrPhone: form.email.trim() || form.phone.trim() || user?.emailOrPhone,
        bloodGroup: form.bloodGroup,
        address: form.address.trim(),
        age: form.age,
        weight: form.weight,
        emergencyContact: form.emergencyContact,
        medicalConditions: form.medicalConditions,
        photo: form.photo,
      })
      setSaved(true)
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : 'Try again.')
    } finally {
      setSaving(false)
    }
  }

  async function choosePhoto() {
    try {
      const photo = await pickProfilePhoto()
      if (!photo) return
      setField('photo', photo)
      await updateUser({ photo })
    } catch (error) {
      Alert.alert('Photo', error instanceof Error ? error.message : 'Could not update photo.')
    }
  }

  async function addNumber() {
    const error = validatePhone(newPhone)
    if (error) {
      setPhoneError(error)
      return
    }
    const value = newPhone.trim()
    const existing = [user?.phone, ...extraPhones].map((item) => String(item || '').replace(/\D/g, ''))
    if (existing.includes(value.replace(/\D/g, ''))) {
      setPhoneError('That number is already on your profile.')
      return
    }
    try {
      if (user?.phone) await updateUser({ phones: [...extraPhones, value] })
      else await updateUser({ phone: value, emailOrPhone: user?.email || value || user?.emailOrPhone })
      setNewPhone('')
      setPhoneError('')
    } catch (error) {
      setPhoneError(error instanceof Error ? error.message : 'Could not add number.')
    }
  }

  return (
    <Screen>
      <View style={styles.photoRow}>
        <Avatar name={form.name} photo={form.photo} size={72} />
        <View style={{ flex: 1 }}>
          <Button title="Change photo" variant="outline" onPress={choosePhoto} />
        </View>
      </View>
      <Field label="Full name" value={form.name} onChangeText={(value) => setField('name', value)} error={errors.name} />
      <Field label="Email" value={form.email} onChangeText={(value) => setField('email', value)} autoCapitalize="none" error={errors.email} />
      <Field label="Phone" value={form.phone} onChangeText={(value) => setField('phone', value)} keyboardType="phone-pad" error={errors.phone} />
      <Text style={[styles.label, { color: colors.text }]}>Blood group</Text>
      <View style={styles.wrap}>
        {BLOOD_GROUPS.map((type) => (
          <Chip key={type} label={type} selected={form.bloodGroup === type} onPress={() => setField('bloodGroup', type)} />
        ))}
      </View>
      {errors.bloodGroup ? <Text style={[styles.error, { color: colors.brand }]}>{errors.bloodGroup}</Text> : null}
      <Field label="Address / area" value={form.address} onChangeText={(value) => setField('address', value)} error={errors.address} />
      <Field label="Age" value={form.age} onChangeText={(value) => setField('age', value)} keyboardType="number-pad" error={errors.age} />
      <Field label="Weight (optional)" value={form.weight} onChangeText={(value) => setField('weight', value)} />
      <Field label="Emergency contact" value={form.emergencyContact} onChangeText={(value) => setField('emergencyContact', value)} />
      <Field label="Medical notes" value={form.medicalConditions} onChangeText={(value) => setField('medicalConditions', value)} multiline />

      <Text style={[styles.section, { color: colors.text }]}>Extra phone numbers</Text>
      {extraPhones.map((number) => (
        <Text key={number} style={[styles.meta, { color: colors.muted }]}>{number}</Text>
      ))}
      <Field label="Add another number" value={newPhone} onChangeText={(value) => { setNewPhone(value); setPhoneError('') }} keyboardType="phone-pad" error={phoneError} />
      <Button title="Add number" variant="outline" onPress={addNumber} />

      <View style={{ height: 16 }} />
      {saved ? <Text style={[styles.ok, { color: colors.success }]}>Profile saved.</Text> : null}
      <Button title="Save profile" onPress={save} loading={saving} />
      <View style={{ height: 12 }} />
      <Button
        title="I donated today"
        variant="outline"
        onPress={() => {
          Alert.alert('Mark a donation?', 'This starts the 90-day wait before you can donate again.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Confirm',
              onPress: () => {
                updateUser({
                  ...markDonatedNow(),
                  donationCount: (Number(user?.donationCount) || 0) + 1,
                }).catch(() => {})
              },
            },
          ])
        }}
      />
    </Screen>
  )
}

export default function EditProfileScreen() {
  return (
    <AuthGate>
      <EditProfileForm />
    </AuthGate>
  )
}

const styles = StyleSheet.create({
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  label: { fontWeight: '700', marginBottom: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  error: { marginBottom: 12, fontWeight: '600' },
  ok: { fontWeight: '700', marginBottom: 12 },
  section: { marginTop: 16, marginBottom: 8, fontWeight: '800' },
  meta: { marginBottom: 4 },
})
