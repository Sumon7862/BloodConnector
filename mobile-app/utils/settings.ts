import * as SecureStore from 'expo-secure-store'

const KEY = 'bloodconnector-settings'

export type LocalSettings = {
  email: boolean
  push: boolean
  campaigns: boolean
  urgent: boolean
  twoFactor: boolean
  showPhone: boolean
  showEmail: boolean
}

export const DEFAULT_SETTINGS: LocalSettings = {
  email: true,
  push: true,
  campaigns: true,
  urgent: true,
  twoFactor: false,
  showPhone: true,
  showEmail: true,
}

export async function loadLocalSettings() {
  try {
    const raw = await SecureStore.getItemAsync(KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as LocalSettings : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function saveLocalSettings(next: LocalSettings) {
  try {
    await SecureStore.setItemAsync(KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}
