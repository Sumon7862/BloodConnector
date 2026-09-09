import { Alert, StyleSheet, Text, View } from 'react-native'
import Screen from '../components/Screen'
import Button from '../components/Button'
import Card from '../components/Card'
import AuthGate from '../components/AuthGate'
import { useAuth } from '../hooks/useAuth'
import { DONATION_WAIT_DAYS, markDonatedNow } from '../utils/eligibility'
import { useTheme } from '../hooks/useTheme'
import DonationCountdown from '../components/DonationCountdown'

function DonationsForm() {
  const { user, updateUser } = useAuth()
  const { colors } = useTheme()
  const count = Number(user?.donationCount) || 0

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>My donations</Text>
      <Text style={[styles.copy, { color: colors.muted }]}>You can donate again {DONATION_WAIT_DAYS} days after your last whole blood donation.</Text>
      <Card>
        <Text style={[styles.stat, { color: colors.brand }]}>{count}</Text>
        <Text style={[styles.meta, { color: colors.muted }]}>Recorded donations</Text>
        <View style={{ marginBottom: 16 }}>
          <DonationCountdown until={user?.nextEligibleAt} />
        </View>
        <Button
          title="I donated today"
          variant="outline"
          onPress={() => {
            Alert.alert('Mark a donation?', 'This starts the 90-day wait.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Confirm',
                onPress: () => {
                  updateUser({
                    ...markDonatedNow(),
                    donationCount: count + 1,
                  }).catch(() => {})
                },
              },
            ])
          }}
        />
      </Card>
      <View style={{ height: 16 }} />
      <Card>
        <Text style={[styles.section, { color: colors.text }]}>History</Text>
        <Text style={[styles.copy, { color: colors.muted }]}>No detailed donation records yet. Tap “I donated today” after you give blood.</Text>
      </Card>
    </Screen>
  )
}

export default function DonationsScreen() {
  return (
    <AuthGate>
      <DonationsForm />
    </AuthGate>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  copy: { lineHeight: 20, marginBottom: 16 },
  stat: { fontSize: 36, fontWeight: '800' },
  meta: { marginBottom: 8 },
  section: { fontWeight: '800', fontSize: 16, marginBottom: 8 },
})
