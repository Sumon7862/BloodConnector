import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useRouter, type Href } from 'expo-router'
import { useEffect, useState } from 'react'
import Screen from '../../components/Screen'
import Button from '../../components/Button'
import RequestCard from '../../components/RequestCard'
import DonorCard from '../../components/DonorCard'
import EmptyState from '../../components/EmptyState'
import BrandMark from '../../components/BrandMark'
import Card from '../../components/Card'
import SectionHeader from '../../components/SectionHeader'
import DonationCountdown from '../../components/DonationCountdown'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { useRequests } from '../../hooks/useRequests'
import { fetchDonors } from '../../services/donorService'
import { matchingRequestsFor, openRequests } from '../../utils/requests'
import { HOW_IT_WORKS, NETWORK_ROLES } from '../../constants/home'
import { radius, shadow } from '../../constants/theme'
import type { Donor } from '../../types'

export default function HomeScreen() {
  const { isLoggedIn, ready, user } = useAuth()
  const { colors } = useTheme()
  const router = useRouter()
  const { requests, refresh } = useRequests()
  const [donors, setDonors] = useState<Donor[]>([])
  const [donorCount, setDonorCount] = useState(0)
  const urgent = openRequests(requests).slice(0, 3)
  const matching = matchingRequestsFor(user, requests).slice(0, 3)

  useEffect(() => {
    fetchDonors().then((list) => {
      setDonorCount(list.length)
      setDonors(list.slice(0, 3))
    })
  }, [])

  return (
    <Screen loading={!ready}>
      <View style={[styles.hero, { backgroundColor: colors.hero }]}>
        <BrandMark light size="lg" subtitle="Bangladesh donor network" />
        <Text style={styles.kicker}>REQUEST · DONATE</Text>
        <Text style={styles.title}>One network when blood cannot wait</Text>
        <Text style={styles.copy}>Every member is a donor. Request blood when you need it, and donate when someone else does.</Text>
        <View style={styles.actions}>
          <Button title="I need blood" onPress={() => router.push(isLoggedIn ? '/request-blood' : '/login')} />
          <Button title="Find a donor" variant="outline" onPress={() => router.push('/(tabs)/donors')} />
        </View>
      </View>

      <SectionHeader
        eyebrow="The network"
        title="Live counts"
        subtitle="Directory donors and open blood requests across Blood Connector."
      />
      <View style={styles.stats}>
        <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <Text style={[styles.statN, { color: colors.brand }]}>{donorCount || '—'}</Text>
          <Text style={[styles.statL, { color: colors.muted }]}>Listed donors</Text>
        </View>
        <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <Text style={[styles.statN, { color: colors.brand }]}>{openRequests(requests).length}</Text>
          <Text style={[styles.statL, { color: colors.muted }]}>Open requests</Text>
        </View>
      </View>

      <SectionHeader
        eyebrow="Need blood · Give blood"
        title="Every member can help both ways"
        subtitle="Request blood when you need it. Donate when a matching request comes in."
      />
      <View style={styles.roles}>
        {NETWORK_ROLES.map((role, index) => (
          <Pressable
            key={role.title}
            onPress={() => router.push((isLoggedIn ? role.authTo : role.guestTo) as Href)}
            style={[styles.role, { backgroundColor: colors.card, borderColor: colors.line }]}
          >
            <Text style={[styles.roleKicker, { color: colors.brand }]}>0{index + 1} · {role.kicker}</Text>
            <Text style={[styles.roleTitle, { color: colors.text }]}>{role.title}</Text>
            <Text style={[styles.roleCopy, { color: colors.muted }]}>{role.copy}</Text>
            <Text style={[styles.link, { color: colors.brand, textAlign: 'left', marginTop: 10 }]}>{role.cta} →</Text>
          </Pressable>
        ))}
      </View>

      {isLoggedIn ? (
        <>
          <SectionHeader
            eyebrow="Your availability"
            title="Donation countdown"
            subtitle="Whole blood donors wait 90 days. Patients see you as available when this is clear."
          />
          <DonationCountdown until={user?.nextEligibleAt} />
          <View style={{ height: 22 }} />
        </>
      ) : null}

      {isLoggedIn ? (
        <>
          <SectionHeader
            eyebrow="Matching requested blood"
            title="Patients waiting for your group"
            subtitle={user?.bloodGroup
              ? `Only ${user.bloodGroup} requests appear here. Contact the requester, or cancel if you cannot help.`
              : 'Add your blood group in Profile to receive matching requests.'}
          />
          {matching.length ? matching.map((item) => (
            <View key={item.id} style={{ marginBottom: 12 }}>
              <RequestCard request={item} mode="inbox" onChanged={refresh} />
            </View>
          )) : (
            <EmptyState
              title={user?.bloodGroup ? `No open ${user.bloodGroup} requests` : 'Add your blood group'}
              body="Matching requests also live on Profile and the Requests tab."
              action="Open matching inbox"
              onAction={() => router.push('/(tabs)/requests')}
            />
          )}
          <Pressable onPress={() => router.push('/(tabs)/requests')} style={styles.linkWrap}>
            <Text style={[styles.link, { color: colors.brand }]}>See all matching requests</Text>
          </Pressable>
        </>
      ) : null}

      <SectionHeader
        eyebrow="Requests"
        title="Urgent blood requests"
        subtitle="Live asks from members. Matching donors get these on their dashboard."
      />
      {urgent.length ? urgent.map((item) => (
        <View key={item.id} style={{ marginBottom: 12 }}>
          <RequestCard request={item} onChanged={refresh} />
        </View>
      )) : <EmptyState title="No open requests yet" body="When someone needs blood, it appears here." />}
      <Pressable onPress={() => router.push('/(tabs)/requests')} style={styles.linkWrap}>
        <Text style={[styles.link, { color: colors.brand }]}>See all requests</Text>
      </Pressable>

      <SectionHeader
        eyebrow="Donors"
        title="Recent donors in your area"
        subtitle="See who is available now, or how long until they can donate again."
      />
      {donors.length ? donors.map((donor) => (
        <View key={donor.id} style={{ marginBottom: 12 }}>
          <DonorCard donor={donor} />
        </View>
      )) : <EmptyState title="No donors listed yet" body="The public directory fills as people are added." />}
      <Pressable onPress={() => router.push('/(tabs)/donors')} style={styles.linkWrap}>
        <Text style={[styles.link, { color: colors.brand }]}>See all donors</Text>
      </Pressable>

      <SectionHeader
        eyebrow="How it works"
        title="Request. Match. Donate."
        subtitle="The same members ask for blood and give it — without leaving Blood Connector."
      />
      {HOW_IT_WORKS.map((item) => (
        <Card key={item.step} style={{ marginBottom: 12 }}>
          <Text style={[styles.roleKicker, { color: colors.brand }]}>{item.kicker}</Text>
          <View style={[styles.step, { backgroundColor: colors.brand }]}>
            <Text style={styles.stepN}>{item.step}</Text>
          </View>
          <Text style={[styles.roleTitle, { color: colors.text, marginTop: 12 }]}>{item.title}</Text>
          <Text style={[styles.roleCopy, { color: colors.muted }]}>{item.copy}</Text>
        </Card>
      ))}
    </Screen>
  )
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.lg,
    padding: 22,
    marginBottom: 22,
    overflow: 'hidden',
  },
  kicker: { color: 'rgba(255,255,255,0.62)', fontWeight: '800', letterSpacing: 1.6, fontSize: 11, marginTop: 18 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 8, lineHeight: 32, letterSpacing: -0.4 },
  copy: { color: 'rgba(255,255,255,0.84)', marginTop: 8, lineHeight: 21 },
  actions: { gap: 10, marginTop: 18 },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  stat: {
    flex: 1,
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1,
    ...shadow.card,
  },
  statN: { fontWeight: '800', fontSize: 24 },
  statL: { marginTop: 4, fontWeight: '700', fontSize: 12 },
  roles: { gap: 12, marginBottom: 22 },
  role: {
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1,
    ...shadow.card,
  },
  roleKicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' },
  roleTitle: { marginTop: 8, fontSize: 18, fontWeight: '800' },
  roleCopy: { marginTop: 6, lineHeight: 20, fontWeight: '600' },
  step: {
    marginTop: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepN: { color: '#fff', fontWeight: '800' },
  linkWrap: { marginVertical: 14 },
  link: { fontWeight: '800', textAlign: 'center' },
})
