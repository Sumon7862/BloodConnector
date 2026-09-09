import { useEffect, useMemo, useState } from 'react'
import { Linking, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Screen from '../../components/Screen'
import Avatar from '../../components/Avatar'
import BloodBadge from '../../components/BloodBadge'
import Button from '../../components/Button'
import Card from '../../components/Card'
import EmptyState from '../../components/EmptyState'
import Chip from '../../components/Chip'
import { fetchDonor } from '../../services/donorService'
import { remainingParts } from '../../utils/eligibility'
import type { Donor } from '../../types'
import { useTheme } from '../../hooks/useTheme'

export default function DonorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors } = useTheme()
  const router = useRouter()
  const [donor, setDonor] = useState<Donor | null>(null)
  const [missing, setMissing] = useState(false)
  const [typeFilter, setTypeFilter] = useState('All')

  useEffect(() => {
    if (!id) return
    fetchDonor(String(id)).then((next) => {
      if (!next) setMissing(true)
      else setDonor(next)
    })
  }, [id])

  const donations = useMemo(() => {
    const list = donor?.donations || []
    if (typeFilter === 'All') return list
    return list.filter((item) => item.type === typeFilter)
  }, [donor, typeFilter])

  const types = useMemo(
    () => ['All', ...Array.from(new Set((donor?.donations || []).map((item) => item.type).filter(Boolean)))] as string[],
    [donor],
  )

  if (missing) {
    return (
      <Screen>
        <EmptyState title="Donor not found" body="This listing may have been removed." action="Back to donors" onAction={() => router.replace('/(tabs)/donors')} />
      </Screen>
    )
  }

  if (!donor) return <Screen loading />

  const avail = remainingParts(donor.nextEligibleAt)

  return (
    <Screen>
      <View style={styles.head}>
        <Avatar name={donor.name} photo={donor.photo} size={72} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>{donor.name}</Text>
          <Text style={[styles.meta, { color: colors.muted }]}>{donor.location || donor.area || 'Location not listed'}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, alignItems: 'center' }}>
            <BloodBadge type={donor.bloodType} />
            <Text style={{ color: avail.done ? colors.success : colors.muted, fontWeight: '700' }}>{avail.label}</Text>
          </View>
        </View>
      </View>
      {donor.phone ? <Button title={`Call ${donor.phone}`} onPress={() => Linking.openURL(`tel:${donor.phone}`)} /> : null}

      <Text style={[styles.section, { color: colors.text }]}>Donation history</Text>
      <View style={styles.wrap}>
        {types.map((type) => (
          <Chip key={type} label={type} selected={typeFilter === type} onPress={() => setTypeFilter(type)} />
        ))}
      </View>
      {donations.length ? donations.map((item, index) => (
        <Card key={item.id || `${item.date}-${index}`} style={{ marginBottom: 10 }}>
          <Text style={[styles.name, { color: colors.text }]}>{item.type || 'Donation'} · {item.status || 'Completed'}</Text>
          <Text style={[styles.meta, { color: colors.muted }]}>{[item.date, item.location, item.recipient].filter(Boolean).join(' · ')}</Text>
          {item.amountMl ? <Text style={[styles.meta, { color: colors.muted }]}>{item.amountMl} ml</Text> : null}
        </Card>
      )) : (
        <EmptyState title="No donations listed yet" body="History appears here when this donor has recorded donations." />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: '800' },
  meta: { marginTop: 4 },
  section: { marginTop: 20, marginBottom: 12, fontWeight: '800', fontSize: 16 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
})
