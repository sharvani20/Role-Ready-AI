const BASE_URL = 'http://127.0.0.1:8000'

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Request failed')
  }

  return response.json()
}