import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import AuthShell from '../components/AuthShell'
import Field from '../components/Field'
import Button from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { validateConfirmPassword, validateEmailOrPhone, validatePassword } from '../utils/validation'

export default function ForgotScreen() {
  const { resetPassword } = useAuth()
  const { colors } = useTheme()
  const router = useRouter()
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({ contact: '', password: '', confirm: '' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit() {
    const next = {
      contact: validateEmailOrPhone(contact),
      password: validatePassword(password),
      confirm: validateConfirmPassword(password, confirm),
    }
    setErrors(next)
    if (next.contact || next.password || next.confirm) return
    setLoading(true)
    const result = await resetPassword(contact, password)
    setLoading(false)
    if (!result.ok) {
      setErrors((current) => ({ ...current, contact: result.error || 'Could not reset password.' }))
      return
    }
    setDone(true)
  }

  return (
    <AuthShell
      title={done ? 'Password updated' : 'Reset password'}
      subtitle={done
        ? `You can now login with the new password for ${contact.trim()}.`
        : 'Use the email or phone on your account. No OTP is required.'}
    >
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}>
        {done ? (
          <Button title="Back to login" onPress={() => router.replace('/login')} />
        ) : (
          <>
            <Field label="Email or phone" value={contact} onChangeText={setContact} autoCapitalize="none" error={errors.contact} />
            <Field label="New password" value={password} onChangeText={setPassword} secureTextEntry error={errors.password} />
            <Field label="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry error={errors.confirm} />
            <Button title="Update password" onPress={submit} loading={loading} />
          </>
        )}
      </View>
      <Pressable onPress={() => router.replace('/login')} style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={[styles.link, { color: colors.brand }]}>Back to login</Text>
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
  link: { fontWeight: '800' },
})
