import { StyleSheet, Text } from 'react-native'
import Screen from '../components/Screen'
import Card from '../components/Card'
import { ABOUT_HERO, ABOUT_MISSION, ABOUT_VISION, WHAT_WE_DO } from '../constants/about'
import { useTheme } from '../hooks/useTheme'

export default function AboutScreen() {
  const { colors } = useTheme()
  return (
    <Screen>
      <Text style={[styles.kicker, { color: colors.brand }]}>ABOUT</Text>
      <Text style={[styles.title, { color: colors.text }]}>A network, not just a directory</Text>
      <Text style={[styles.copy, { color: colors.muted }]}>{ABOUT_HERO}</Text>
      <Card style={{ marginBottom: 12 }}>
        <Text style={[styles.section, { color: colors.text }]}>Mission</Text>
        <Text style={[styles.copy, { color: colors.muted }]}>{ABOUT_MISSION}</Text>
      </Card>
      <Card style={{ marginBottom: 12 }}>
        <Text style={[styles.section, { color: colors.text }]}>Vision</Text>
        <Text style={[styles.copy, { color: colors.muted }]}>{ABOUT_VISION}</Text>
      </Card>
      {WHAT_WE_DO.map((item) => (
        <Card key={item.title} style={{ marginBottom: 12 }}>
          <Text style={[styles.section, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.copy, { color: colors.muted }]}>{item.copy}</Text>
        </Card>
      ))}
    </Screen>
  )
}

const styles = StyleSheet.create({
  kicker: { fontWeight: '800', letterSpacing: 1.2, fontSize: 12 },
  title: { fontSize: 24, fontWeight: '800', marginTop: 6, marginBottom: 12 },
  section: { fontWeight: '800', fontSize: 16, marginBottom: 6 },
  copy: { lineHeight: 20 },
})
