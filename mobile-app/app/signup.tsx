import { useEffect, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import AuthShell from '../components/AuthShell'
import Field from '../components/Field'
import Button from '../components/Button'
import Chip from '../components/Chip'
import Avatar from '../components/Avatar'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { BLOOD_GROUPS } from '../constants/blood'
import { pickProfilePhoto } from '../utils/pickImage'
import {
  validateAddress,
  validateAge,
  validateBloodGroup,
  validateConfirmPassword,
  validateEmailOrPhone,
  validateFullName,
  validatePassword,
} from '../utils/validation'

export default function SignupScreen() {
  const { register, isLoggedIn, ready } = useAuth()
  const { colors } = useTheme()
  const router = useRouter()
  const [values, setValues] = useState({
    fullName: '',
    emailOrPhone: '',
    address: '',
    photo: '',
    bloodGroup: '',
    age: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ready && isLoggedIn) router.replace('/(tabs)/profile')
  }, [ready, isLoggedIn, router])

  function setField(name: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  async function choosePhoto() {
    try {
      const photo = await pickProfilePhoto()
      if (photo) setField('photo', photo)
    } catch (error) {
      Alert.alert('Photo', error instanceof Error ? error.message : 'Could not read that photo.')
    }
  }

  async function submit() {
    const next = {
      fullName: validateFullName(values.fullName),
      emailOrPhone: validateEmailOrPhone(values.emailOrPhone),
      address: validateAddress(values.address),
      bloodGroup: validateBloodGroup(values.bloodGroup),
      age: validateAge(values.age),
      password: validatePassword(values.password),
      confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return
    setLoading(true)
    const result = await register({
      fullName: values.fullName,
      emailOrPhone: values.emailOrPhone,
      role: 'donor',
      address: values.address,
      photo: values.photo,
      bloodGroup: values.bloodGroup,
      age: values.age,
      password: values.password,
      email: values.emailOrPhone.includes('@') ? values.emailOrPhone : '',
      phone: values.emailOrPhone.includes('@') ? '' : values.emailOrPhone,
    })
    setLoading(false)
    if (!result.ok) {
      setErrors((current) => ({ ...current, emailOrPhone: result.error || 'Could not create account.' }))
      return
    }
    router.replace('/(tabs)/profile')
  }

  return (
    <AuthShell title="Create account" subtitle="Join as a donor. Request blood when you need it, and donate when someone else does.">
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}>
        <View style={styles.photoRow}>
          <Avatar name={values.fullName || 'New'} photo={values.photo} size={64} />
          <View style={{ flex: 1 }}>
            <Button title={values.photo ? 'Change photo' : 'Add photo'} variant="outline" onPress={choosePhoto} />
          </View>
        </View>
        <Field label="Full name" value={values.fullName} onChangeText={(value) => setField('fullName', value)} placeholder="Your name" error={errors.fullName} />
        <Field
          label="Email or phone"
          value={values.emailOrPhone}
          onChangeText={(value) => setField('emailOrPhone', value)}
          autoCapitalize="none"
          placeholder="you@email.com"
          error={errors.emailOrPhone}
        />
        <Field label="Address / area" value={values.address} onChangeText={(value) => setField('address', value)} placeholder="Hospital, city or area" error={errors.address} />
        <Text style={[styles.label, { color: colors.text }]}>Blood group</Text>
        <View style={styles.wrap}>
          {BLOOD_GROUPS.map((type) => (
            <Chip key={type} label={type} selected={values.bloodGroup === type} onPress={() => setField('bloodGroup', type)} />
          ))}
        </View>
        {errors.bloodGroup ? <Text style={[styles.error, { color: colors.brand }]}>{errors.bloodGroup}</Text> : null}
        <Field label="Age" value={values.age} onChangeText={(value) => setField('age', value)} keyboardType="number-pad" placeholder="18–65" error={errors.age} />
        <Field label="Password" value={values.password} onChangeText={(value) => setField('password', value)} secureTextEntry error={errors.password} />
        <Field label="Confirm password" value={values.confirmPassword} onChangeText={(value) => setField('confirmPassword', value)} secureTextEntry error={errors.confirmPassword} />
        <Button title="Create donor account" onPress={submit} loading={loading} />
      </View>
      <Pressable onPress={() => router.push('/login')} style={styles.loginLink}>
        <Text style={[styles.meta, { color: colors.muted }]}>Already have an account? <Text style={[styles.link, { color: colors.brand }]}>Login</Text></Text>
      </Pressable>
    </AuthShell>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  label: { fontWeight: '800', marginBottom: 8, fontSize: 13 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  error: { marginBottom: 12, fontWeight: '700' },
  loginLink: { marginTop: 22, alignItems: 'center' },
  meta: { fontWeight: '600' },
  link: { fontWeight: '800' },
})
