import * as ImagePicker from 'expo-image-picker'

const MAX_BYTES = 1_200_000

export async function pickProfilePhoto() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!permission.granted) throw new Error('Photo permission is required to update your picture.')

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.6,
    base64: true,
  })
  if (result.canceled || !result.assets[0]) return ''

  const asset = result.assets[0]
  const size = asset.fileSize || (asset.base64 ? Math.ceil((asset.base64.length * 3) / 4) : 0)
  if (size > MAX_BYTES) throw new Error('Please choose a photo under 1.2 MB.')

  const mime = asset.mimeType || 'image/jpeg'
  if (asset.base64) return `data:${mime};base64,${asset.base64}`
  return asset.uri
}
