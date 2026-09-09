import { Image, StyleSheet, Text, View } from 'react-native'
import { getInitials } from '../utils/validation'

export default function Avatar({ name, photo, size = 48 }: { name?: string; photo?: string; size?: number }) {
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      {photo ? (
        <Image source={{ uri: photo }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.text, { fontSize: size * 0.32 }]}>{getInitials(name)}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: '#e11d2d', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  text: { color: '#fff', fontWeight: '800' },
})
