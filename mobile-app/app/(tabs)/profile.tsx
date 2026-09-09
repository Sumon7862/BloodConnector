import { Alert, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import Screen from '../../components/Screen'
import Button from '../../components/Button'
import Avatar from '../../components/Avatar'
import BloodBadge from '../../components/BloodBadge'
import Card from '../../components/Card'
import MenuRow from '../../components/MenuRow'
import DonationCountdown from '../../components/DonationCountdown'
import { useAuth } from '../../hooks/useAuth'
import { remainingParts } from '../../utils/eligibility'
import { radius, shadow } from '../../constants/theme'
import { useTheme } from '../../hooks/useTheme'

export default function ProfileScreen() {
  const { user, isLoggedIn, logout } = useAuth()
  const { colors } = useTheme()
  const router = useRouter()

  if (!isLoggedIn || !user) {
    return (
      <Screen>
        <Card>
          <Text style={[styles.guestTitle, { color: colors.text }]}>Your donor desk</Text>
          <Text style={[styles.guestCopy, { color: colors.muted }]}>Login to request blood, donate, and manage your Blood Connector profile.</Text>
          <Button title="Login" onPress={() => router.push('/login')} />
          <View style={{ height: 10 }} />
          <Button title="Create account" variant="outline" onPress={() => router.push('/signup')} />
        </Card>
      </Screen>
    )
  }

  const avail = remainingParts(user.nextEligibleAt)

  return (
    <Screen>
      <View style={[styles.head, { backgroundColor: colors.card, borderColor: colors.line }]}>
        <Avatar name={user.name} photo={user.photo} size={76} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.meta, { color: colors.muted }]}>{user.emailOrPhone}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, alignItems: 'center' }}>
            <BloodBadge type={user.bloodGroup} />
            <Text style={{ color: avail.done ? colors.success : colors.muted, fontWeight: '800', fontSize: 12 }}>{avail.label}</Text>
          </View>
        </View>
      </View>
      <Button title="Request blood" onPress={() => router.push('/request-blood')} />
      <View style={{ height: 16 }} />
      <DonationCountdown until={user.nextEligibleAt} />
      <View style={[styles.menu, { borderColor: colors.line }]}>
        <MenuRow title="Matching requested blood" subtitle="Donate to requests that match your group" onPress={() => router.push('/(tabs)/requests')} />
        <MenuRow title="Edit profile" subtitle="Photo, blood group, phones" onPress={() => router.push('/edit-profile')} />
        <MenuRow title="My donations" subtitle="Eligibility countdown" onPress={() => router.push('/donations')} />
        <MenuRow title="Family & donors" subtitle="People you may need to reach" onPress={() => router.push('/family')} />
        <MenuRow title="Gallery" subtitle="Share a short community note" onPress={() => router.push('/gallery')} />
        <MenuRow title="Blood types" subtitle="Compatibility guide" onPress={() => router.push('/blood-types')} />
        <MenuRow title="About" subtitle="Blood Connector mission" onPress={() => router.push('/about')} />
        <MenuRow title="Settings" subtitle="Theme, password and preferences" onPress={() => router.push('/settings')} />
        <MenuRow
          title="Log out"
          danger
          onPress={() => {
            Alert.alert('Log out?', 'You can sign in again anytime.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log out', style: 'destructive', onPress: () => logout() },
            ])
          }}
        />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1,
    ...shadow.card,
  },
  name: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  meta: { marginTop: 4, fontWeight: '600' },
  menu: {
    marginTop: 16,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    ...shadow.card,
  },
  guestTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  guestCopy: { lineHeight: 20, marginBottom: 16 },
})
