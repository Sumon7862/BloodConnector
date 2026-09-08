export function sendError(res, status, error) {
  return res.status(status).json({ error })
}

export function notFound(_req, res) {
  return sendError(res, 404, 'Not found.')
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Server error.'
  if (status >= 500) console.error(err)
  return res.status(status).json({ error: message })
}
