import { StyleSheet, Text, View } from 'react-native'
import Screen from '../components/Screen'
import Card from '../components/Card'
import BloodBadge from '../components/BloodBadge'
import { BLOOD_COMPAT } from '../constants/blood'
import { useTheme } from '../hooks/useTheme'

export default function BloodTypesScreen() {
  const { colors } = useTheme()
  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Blood type information</Text>
      <Text style={[styles.copy, { color: colors.muted }]}>Compatibility is shown here for education. Matching requests still use an exact blood group, same as the website.</Text>
      {BLOOD_COMPAT.map((item) => (
        <Card key={item.type} style={{ marginBottom: 12, alignItems: 'center' }}>
          <BloodBadge type={item.type} size="lg" />
          <Text style={[styles.label, { color: colors.muted }]}>Can donate to</Text>
          <Text style={[styles.value, { color: colors.text }]}>{item.donate}</Text>
          <Text style={[styles.label, { color: colors.muted }]}>Can receive from</Text>
          <Text style={[styles.value, { color: colors.text }]}>{item.receive}</Text>
        </Card>
      ))}
      <View style={{ height: 8 }} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  copy: { lineHeight: 20, marginBottom: 16 },
  label: { marginTop: 12, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  value: { fontWeight: '700', textAlign: 'center', marginTop: 4 },
})
