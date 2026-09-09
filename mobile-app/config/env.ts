const fallback = 'https://bloodconnector-4a5q.onrender.com/api'

export const API_URL = String(process.env.EXPO_PUBLIC_API_URL || fallback).replace(/\/$/, '')
