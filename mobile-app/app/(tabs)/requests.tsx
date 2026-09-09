import { StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import Screen from '../../components/Screen'
import Button from '../../components/Button'
import RequestCard from '../../components/RequestCard'
import EmptyState from '../../components/EmptyState'
import { useAuth } from '../../hooks/useAuth'
import { useRequests } from '../../hooks/useRequests'
import { matchingRequestsFor, openRequests } from '../../utils/requests'
import { useTheme } from '../../hooks/useTheme'

export default function RequestsScreen() {
  const { user, isLoggedIn } = useAuth()
  const { colors } = useTheme()
  const router = useRouter()
  const { requests, loading, refresh } = useRequests()
  const matching = matchingRequestsFor(user, requests)
  const open = openRequests(requests)

  return (
    <Screen loading={loading}>
      <Text style={[styles.title, { color: colors.text }]}>Matching requested blood</Text>
      <Text style={[styles.copy, { color: colors.muted }]}>
        {isLoggedIn && user?.bloodGroup
          ? `Only ${user.bloodGroup} requests appear in Matching you. Contact the requester, or cancel if you cannot help.`
          : 'Matching donors see exact blood-group requests and can call the requester.'}
      </Text>
      <Button title={isLoggedIn ? 'Request blood' : 'Login to request'} onPress={() => router.push(isLoggedIn ? '/request-blood' : '/login')} />

      {isLoggedIn ? (
        <>
          <Text style={[styles.section, { color: colors.text }]}>Matching you — donate blood</Text>
          <Text style={[styles.note, { color: colors.muted }]}>These are incoming requests for your blood group. Cancel removes them from your inbox only.</Text>
          {user?.bloodGroup ? (
            matching.length ? matching.map((item) => (
              <View key={item.id} style={{ marginBottom: 12 }}>
                <RequestCard request={item} mode="inbox" onChanged={refresh} />
              </View>
            )) : <EmptyState title={`No open ${user.bloodGroup} requests`} />
          ) : (
            <EmptyState title="Add your blood group" body="Update profile so matching requests appear here." action="Edit profile" onAction={() => router.push('/edit-profile')} />
          )}
        </>
      ) : null}

      <Text style={[styles.section, { color: colors.text }]}>All open requests</Text>
      <Text style={[styles.note, { color: colors.muted }]}>Public feed of every open request. Matching donors still use an exact blood group.</Text>
      {open.length ? open.map((item) => (
        <View key={item.id} style={{ marginBottom: 12 }}>
          <RequestCard request={item} onChanged={refresh} />
        </View>
      )) : <EmptyState title="No open requests" />}
    </Screen>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 6, letterSpacing: -0.3 },
  copy: { marginBottom: 16, lineHeight: 20 },
  section: { fontWeight: '800', fontSize: 16, marginTop: 20, marginBottom: 6 },
  note: { marginBottom: 12, fontSize: 13, lineHeight: 18, fontWeight: '600' },
})
