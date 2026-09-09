import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import type { BloodRequest } from '../types'
import { useAuth } from '../hooks/useAuth'
import { closeRequest, contactRequester, dismissRequest, setResponseStatus } from '../services/bloodRequestService'
import { formatRequestTime, matchesBloodGroup, userIdFrom } from '../utils/requests'
import Avatar from './Avatar'
import BloodBadge from './BloodBadge'
import Button from './Button'
import Card from './Card'
import { useTheme } from '../hooks/useTheme'

function urgencyStyle(level: string, isDark: boolean) {
  if (level === 'Critical') return { backgroundColor: isDark ? '#3f1218' : '#ffe4e6', color: '#e11d2d' }
  if (level === 'High') return { backgroundColor: isDark ? '#3f2d12' : '#fef3c7', color: isDark ? '#fbbf24' : '#b45309' }
  return { backgroundColor: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#cbd5e1' : '#475569' }
}

export default function RequestCard({
  request,
  mode = 'feed',
  onChanged,
}: {
  request: BloodRequest
  mode?: 'feed' | 'inbox' | 'owner'
  onChanged?: () => void
}) {
  const { user, isLoggedIn } = useAuth()
  const { colors, isDark } = useTheme()
  const router = useRouter()
  const myId = userIdFrom(user)
  const isOwner = Boolean(myId && request.requesterId === myId)
  const isMatch = isLoggedIn && !isOwner && matchesBloodGroup(user?.bloodGroup, request.bloodType)
  const view = isOwner ? 'owner' : mode
  const urgency = urgencyStyle(request.urgency, isDark)

  async function run(action: () => Promise<unknown>) {
    try {
      await action()
      onChanged?.()
    } catch (error) {
      Alert.alert('Could not update', error instanceof Error ? error.message : 'Try again.')
    }
  }

  return (
    <Card>
      <View style={styles.top}>
        <Avatar name={request.requesterName} photo={request.requesterPhoto} size={40} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.kicker, { color: colors.muted }]}>Requested by</Text>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{request.requesterName}</Text>
          <Text style={[styles.meta, { color: colors.muted }]} numberOfLines={1}>{request.location}</Text>
          <Text style={[styles.time, { color: colors.muted }]}>{formatRequestTime(request.createdAt)}</Text>
        </View>
        <View style={styles.right}>
          <BloodBadge type={request.bloodType} size="lg" />
          <View style={[styles.urgency, { backgroundColor: urgency.backgroundColor }]}>
            <Text style={[styles.urgencyText, { color: urgency.color }]}>{request.urgency}</Text>
          </View>
        </View>
      </View>
      {request.details ? <Text style={[styles.details, { color: colors.text }]}>{request.details}</Text> : null}

      {view === 'feed' ? (
        isMatch ? (
          <Button title="Open matching inbox" onPress={() => router.push('/(tabs)/requests')} />
        ) : (
          <Text style={[styles.hint, { color: colors.muted }]}>Matching {request.bloodType} donors see this in their inbox.</Text>
        )
      ) : null}

      {view === 'inbox' ? (
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Button
              title="Contact"
              onPress={() => {
                if (request.contact) Linking.openURL(`tel:${request.contact}`)
                run(() => contactRequester(request.id))
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Cancel" variant="outline" onPress={() => run(() => dismissRequest(request.id))} />
          </View>
        </View>
      ) : null}

      {view === 'owner' ? (
        <View style={{ gap: 8 }}>
          {request.contact ? <Text style={[styles.meta, { color: colors.muted }]}>Your contact: {request.contact}</Text> : null}
          {request.status === 'open' ? (
            <Button title="Mark as filled" variant="outline" onPress={() => run(() => closeRequest(request.id, 'filled'))} />
          ) : (
            <Text style={[styles.hint, { color: colors.muted }]}>{request.status}</Text>
          )}
          {(request.responses || []).map((item) => (
            <View key={item.id} style={[styles.offer, { borderTopColor: colors.line }]}>
              <Text style={[styles.name, { color: colors.text }]}>{item.donorName} · {item.status}</Text>
              {item.message ? <Text style={[styles.meta, { color: colors.muted }]}>{item.message}</Text> : null}
              {item.donorPhone ? (
                <Button title={`Call ${item.donorPhone}`} variant="outline" onPress={() => Linking.openURL(`tel:${item.donorPhone}`)} />
              ) : null}
              {item.status === 'offered' ? (
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Button title="Accept" onPress={() => run(() => setResponseStatus(request.id, item.id, 'accepted'))} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button title="Decline" variant="outline" onPress={() => run(() => setResponseStatus(request.id, item.id, 'declined'))} />
                  </View>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  )
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  right: { alignItems: 'flex-end', gap: 6 },
  urgency: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  urgencyText: { fontWeight: '800', fontSize: 11 },
  name: { fontWeight: '800', marginTop: 4 },
  meta: { marginTop: 2 },
  time: { fontSize: 12, marginTop: 2 },
  details: { marginVertical: 12, lineHeight: 20 },
  hint: { marginTop: 12, fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8, marginTop: 12 },
  offer: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, gap: 8 },
})
