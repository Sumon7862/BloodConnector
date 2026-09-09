import { StyleSheet, View, type ViewProps } from 'react-native'
import { radius, shadow } from '../constants/theme'
import { useTheme } from '../hooks/useTheme'

export default function Card({ style, children, ...props }: ViewProps) {
  const { colors } = useTheme()
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.line },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 16,
    ...shadow.card,
  },
})
