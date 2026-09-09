import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../hooks/useTheme'

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  const { colors } = useTheme()
  return (
    <View style={styles.wrap}>
      {eyebrow ? <Text style={[styles.eyebrow, { color: colors.brand }]}>{eyebrow}</Text> : null}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.sub, { color: colors.muted }]}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  sub: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
})
