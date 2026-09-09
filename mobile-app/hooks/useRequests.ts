import { useCallback, useEffect, useState } from 'react'
import { loadRequests } from '../services/bloodRequestService'
import type { BloodRequest } from '../types'
import { useAuth } from './useAuth'

export function useRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setError('')
    try {
      setRequests(await loadRequests())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load requests.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh, user?.id])

  return { requests, loading, error, refresh }
}
