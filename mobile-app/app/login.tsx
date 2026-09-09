import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import AuthShell from '../components/AuthShell'
import Field from '../components/Field'
import Button from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { validateEmailOrPhone, validatePassword } from '../utils/validation'

export default function LoginScreen() {
  const { login, isLoggedIn, ready } = useAuth()
  const { colors } = useTheme()
  const router = useRouter()
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ emailOrPhone: '', password: '' })
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ready && isLoggedIn) router.replace('/(tabs)/profile')
  }, [ready, isLoggedIn, router])

  async function submit() {
    const next = {
      emailOrPhone: validateEmailOrPhone(emailOrPhone),
      password: validatePassword(password),
    }
    setErrors(next)
    if (next.emailOrPhone || next.password) return
    setLoading(true)
    const result = await login(emailOrPhone, password)
    setLoading(false)
    if (!result.ok) {
      setFormError(result.error || 'Could not sign in.')
      return
    }
    router.replace('/(tabs)/profile')
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in with the same email or phone you use on the website.">
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}>
        <Field
          label="Email or phone"
          value={emailOrPhone}
          onChangeText={(value) => { setEmailOrPhone(value); setFormError('') }}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@email.com"
          error={errors.emailOrPhone}
        />
        <Field
          label="Password"
          value={password}
          onChangeText={(value) => { setPassword(value); setFormError('') }}
          secureTextEntry
          placeholder="••••••••"
          error={errors.password}
        />
        {formError ? <Text style={[styles.error, { color: colors.brand }]}>{formError}</Text> : null}
        <Button title="Login" onPress={submit} loading={loading} />
        <Pressable onPress={() => router.push('/forgot')} style={styles.linkWrap}>
          <Text style={[styles.link, { color: colors.brand }]}>Forgot password?</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        <Text style={[styles.meta, { color: colors.muted }]}>New to Blood Connector?</Text>
        <Pressable onPress={() => router.push('/signup')}>
          <Text style={[styles.link, { color: colors.brand }]}>Create account</Text>
        </Pressable>
      </View>
    </AuthShell>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  error: { fontWeight: '800', marginBottom: 12 },
  linkWrap: { marginTop: 16, alignItems: 'center' },
  link: { fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 22, flexWrap: 'wrap' },
  meta: { fontWeight: '600' },
})
