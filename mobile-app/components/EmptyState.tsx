import { StyleSheet, Text, View } from 'react-native'
import { radius, shadow } from '../constants/theme'
import { useTheme } from '../hooks/useTheme'
import Button from './Button'

export default function EmptyState({
  title,
  body,
  action,
  onAction,
}: {
  title: string
  body?: string
  action?: string
  onAction?: () => void
}) {
  const { colors } = useTheme()
  return (
    <View style={[styles.wrap, { backgroundColor: colors.card, borderColor: colors.line }]}>
      <View style={[styles.dot, { backgroundColor: colors.brand }]} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {body ? <Text style={[styles.body, { color: colors.muted }]}>{body}</Text> : null}
      {action && onAction ? <View style={{ width: '100%', marginTop: 6 }}><Button title={action} onPress={onAction} /></View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    ...shadow.card,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginBottom: 4 },
  title: { fontWeight: '800', fontSize: 17, textAlign: 'center' },
  body: { textAlign: 'center', lineHeight: 20, marginBottom: 4 },
})
