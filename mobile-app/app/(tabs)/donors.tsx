import { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Screen from '../../components/Screen'
import Field from '../../components/Field'
import DonorCard from '../../components/DonorCard'
import EmptyState from '../../components/EmptyState'
import Chip from '../../components/Chip'
import { BLOOD_GROUPS } from '../../constants/blood'
import { fetchDonors } from '../../services/donorService'
import { filterDonors } from '../../utils/donorsFilter'
import type { Donor } from '../../types'
import { useTheme } from '../../hooks/useTheme'

export default function DonorsScreen() {
  const { colors } = useTheme()
  const [all, setAll] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [area, setArea] = useState('')
  const [bloodType, setBloodType] = useState('')
  const [availability, setAvailability] = useState('')

  useEffect(() => {
    fetchDonors().then((list) => {
      setAll(list)
      setLoading(false)
    })
  }, [])

  const donors = useMemo(
    () => filterDonors(all, { q, area, bloodType, availability }),
    [all, q, area, bloodType, availability],
  )

  return (
    <Screen loading={loading}>
      <Text style={[styles.title, { color: colors.text }]}>Find a donor</Text>
      <Text style={[styles.copy, { color: colors.muted }]}>Search the Blood Connector directory by name, area, or blood group.</Text>
      <Field label="Search name or phone" value={q} onChangeText={setQ} />
      <Field label="Area" value={area} onChangeText={setArea} placeholder="City or area" />
      <Text style={[styles.label, { color: colors.text }]}>Blood group</Text>
      <View style={styles.wrap}>
        {['', ...BLOOD_GROUPS].map((type) => (
          <Chip key={type || 'all'} label={type || 'All'} selected={bloodType === type} onPress={() => setBloodType(type)} />
        ))}
      </View>
      <View style={[styles.wrap, { marginBottom: 16 }]}>
        {[
          ['', 'Any status'],
          ['available', 'Available'],
          ['unavailable', 'Waiting'],
        ].map(([value, label]) => (
          <Chip key={value} label={label} selected={availability === value} onPress={() => setAvailability(value)} />
        ))}
      </View>
      {donors.length ? donors.map((donor) => (
        <View key={donor.id} style={{ marginBottom: 12 }}>
          <DonorCard donor={donor} />
        </View>
      )) : (
        <EmptyState title="No donors matched" body="Try another area or blood group." />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 6, letterSpacing: -0.3 },
  copy: { marginBottom: 16, lineHeight: 20 },
  label: { fontWeight: '700', marginBottom: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
})
