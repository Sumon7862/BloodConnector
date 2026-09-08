export function timeAgo(iso) {
  const start = new Date(iso).getTime()
  if (!Number.isFinite(start)) return ''
  const diff = Date.now() - start
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function noteForClient(note) {
  return {
    id: note.id,
    title: note.title,
    message: note.message,
    to: note.to || '',
    tone: note.tone || 'drop',
    unread: Boolean(note.unread),
    time: timeAgo(note.createdAt),
    createdAt: note.createdAt,
  }
}
