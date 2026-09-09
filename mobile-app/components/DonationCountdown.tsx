import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { radius } from '../constants/theme'
import { useTheme } from '../hooks/useTheme'
import { padTime, remainingParts } from '../utils/eligibility'

export default function DonationCountdown({
  until,
  label = 'Available again in',
}: {
  until?: string
  label?: string
}) {
  const { colors, isDark } = useTheme()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const parts = remainingParts(until, now)
  const ready = parts.done
  const boxes = [
    [ready ? 0 : parts.days, 'Days'],
    [ready ? '00' : padTime(parts.hours), 'Hours'],
    [ready ? '00' : padTime(parts.minutes), 'Mins'],
    [ready ? '00' : padTime(parts.seconds), 'Secs'],
  ] as const

  return (
    <View
      style={[
        styles.wrap,
        {
          borderColor: ready ? (isDark ? '#065f46' : '#a7f3d0') : (isDark ? '#7f1d1d' : '#fecdd3'),
          backgroundColor: ready ? (isDark ? '#052e24' : '#ecfdf5') : (isDark ? '#3f1218' : '#fff1f2'),
        },
      ]}
    >
      <View style={styles.head}>
        <Text style={[styles.label, { color: ready ? colors.success : colors.brand }]}>
          {ready ? 'Available now' : label}
        </Text>
        <View style={[styles.pill, { backgroundColor: ready ? colors.success : colors.brand }]}>
          <Text style={styles.pillText}>{ready ? 'Available' : 'Waiting'}</Text>
        </View>
      </View>
      <View style={styles.grid}>
        {boxes.map(([value, name]) => (
          <View
            key={name}
            style={[
              styles.box,
              {
                backgroundColor: colors.card,
                borderColor: ready ? (isDark ? '#065f46' : '#d1fae5') : (isDark ? '#7f1d1d' : '#fecdd3'),
              },
            ]}
          >
            <Text style={[styles.value, { color: ready ? colors.success : colors.brand }]}>{value}</Text>
            <Text style={[styles.name, { color: colors.muted }]}>{name}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 12,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    gap: 6,
  },
  box: {
    flex: 1,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  name: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
})
