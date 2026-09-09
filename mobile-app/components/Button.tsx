import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { radius, shadow } from '../constants/theme'
import { useTheme } from '../hooks/useTheme'

type Props = {
  title: string
  onPress?: () => void
  variant?: 'primary' | 'outline' | 'ghost'
  disabled?: boolean
  loading?: boolean
}

export default function Button({ title, onPress, variant = 'primary', disabled, loading }: Props) {
  const { colors } = useTheme()
  const outline = variant === 'outline'
  const ghost = variant === 'ghost'
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && { backgroundColor: colors.brand, ...shadow.card },
        outline && { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.line },
        ghost && { backgroundColor: 'transparent' },
        (pressed || disabled) && { opacity: 0.72 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline || ghost ? colors.brand : '#fff'} />
      ) : (
        <Text style={[styles.text, (outline || ghost) && { color: outline ? colors.text : colors.brand }]}>
          {title}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  text: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.2 },
})
