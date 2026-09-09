import { useEffect, useState } from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import Screen from '../components/Screen'
import Field from '../components/Field'
import Button from '../components/Button'
import Card from '../components/Card'
import AuthGate from '../components/AuthGate'
import { useAuth } from '../hooks/useAuth'
import { DEFAULT_SETTINGS, loadLocalSettings, saveLocalSettings, type LocalSettings } from '../utils/settings'
import { validateConfirmPassword, validatePassword } from '../utils/validation'
import { useTheme } from '../hooks/useTheme'

function ToggleRow({
  title,
  copy,
  value,
  onChange,
  colors,
}: {
  title: string
  copy: string
  value: boolean
  onChange: (next: boolean) => void
  colors: { brand: string; text: string; muted: string; line: string }
}) {
  return (
    <View style={[styles.toggle, { borderTopColor: colors.line }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.toggleTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.copy, { color: colors.muted }]}>{copy}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.brand }} />
    </View>
  )
}

function SettingsForm() {
  const { changePassword, hasPassword } = useAuth()
  const { colors, isDark, toggle: toggleTheme } = useTheme()
  const [settings, setSettings] = useState<LocalSettings>(DEFAULT_SETTINGS)
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [passErrors, setPassErrors] = useState<Record<string, string>>({})
  const [passSaved, setPassSaved] = useState(false)
  const [savingPass, setSavingPass] = useState(false)

  useEffect(() => {
    loadLocalSettings().then(setSettings)
  }, [])

  function togglePref(key: keyof LocalSettings) {
    const next = { ...settings, [key]: !settings[key] }
    setSettings(next)
    saveLocalSettings(next)
  }

  async function savePassword() {
    const nextErrors = {
      current: hasPassword && !passwords.current ? 'Current password is required' : '',
      next: validatePassword(passwords.next),
      confirm: validateConfirmPassword(passwords.next, passwords.confirm),
    }
    setPassErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return
    setSavingPass(true)
    const result = await changePassword(passwords.current, passwords.next)
    setSavingPass(false)
    if (!result.ok) {
      setPassErrors({ current: result.error || 'Could not update password.' })
      return
    }
    setPasswords({ current: '', next: '', confirm: '' })
    setPassSaved(true)
  }

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      <Card style={{ marginBottom: 16 }}>
        <Text style={[styles.section, { color: colors.text }]}>Appearance</Text>
        <ToggleRow
          title="Dark mode"
          copy={isDark ? 'Black surfaces, light text' : 'Light surfaces, dark text'}
          value={isDark}
          onChange={() => toggleTheme()}
          colors={colors}
        />
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <Text style={[styles.section, { color: colors.text }]}>Notification preferences</Text>
        <Text style={[styles.hint, { color: colors.muted }]}>These stay on this device, same as the website toggles. They are not a push-notification service.</Text>
        <ToggleRow title="Email notifications" copy="Receive updates via email" value={settings.email} onChange={() => togglePref('email')} colors={colors} />
        <ToggleRow title="Push notifications" copy="Preference only — no device push API yet" value={settings.push} onChange={() => togglePref('push')} colors={colors} />
        <ToggleRow title="Gallery alerts" copy="Community stories" value={settings.campaigns} onChange={() => togglePref('campaigns')} colors={colors} />
        <ToggleRow title="Urgent requests" copy="Emergency blood needed" value={settings.urgent} onChange={() => togglePref('urgent')} colors={colors} />
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <Text style={[styles.section, { color: colors.text }]}>Privacy</Text>
        <ToggleRow title="Show phone number" copy="Let other members see your primary number" value={settings.showPhone} onChange={() => togglePref('showPhone')} colors={colors} />
        <ToggleRow title="Show email" copy="Let other members see your email" value={settings.showEmail} onChange={() => togglePref('showEmail')} colors={colors} />
      </Card>
      <Card>
        <Text style={[styles.section, { color: colors.text }]}>{hasPassword ? 'Change password' : 'Set password'}</Text>
        {hasPassword ? (
          <Field label="Current password" value={passwords.current} onChangeText={(value) => setPasswords((c) => ({ ...c, current: value }))} secureTextEntry error={passErrors.current} />
        ) : null}
        <Field label="New password" value={passwords.next} onChangeText={(value) => setPasswords((c) => ({ ...c, next: value }))} secureTextEntry error={passErrors.next} />
        <Field label="Confirm password" value={passwords.confirm} onChangeText={(value) => setPasswords((c) => ({ ...c, confirm: value }))} secureTextEntry error={passErrors.confirm} />
        {passSaved ? <Text style={[styles.ok, { color: colors.success }]}>Password updated.</Text> : null}
        <Button title="Save password" onPress={savePassword} loading={savingPass} />
      </Card>
    </Screen>
  )
}

export default function SettingsScreen() {
  return (
    <AuthGate>
      <SettingsForm />
    </AuthGate>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
  section: { fontWeight: '800', fontSize: 16, marginBottom: 8 },
  hint: { marginBottom: 12, fontSize: 12, lineHeight: 18 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1 },
  toggleTitle: { fontWeight: '700' },
  copy: { fontSize: 12, marginTop: 2 },
  ok: { fontWeight: '700', marginBottom: 12 },
})
