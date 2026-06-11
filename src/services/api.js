import axios from 'axios'
import tokenManager from './tokenManager'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function getAuthHeaders() {
  const token = tokenManager.getAccessToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export function parseApiError(error, fallback = 'Request failed') {
  if (error.response?.status === 401) return 'Authentication required'
  if (error.response?.status === 403) return 'Access denied'
  if (error.response?.status === 404) return 'Not found'
  if (error.code === 'ECONNABORTED') return 'Request timeout'
  if (!error.response) return 'Network error. Please check your connection.'

  const detail = error.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || JSON.stringify(item)).join(', ')
  }
  return error.response?.data?.message || fallback
}

export function buildUserFromToken(accessToken, loginId) {
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]))
    return {
      id: payload.sub,
      role: payload.role,
      login_id: loginId,
    }
  } catch {
    return { login_id: loginId, role: 'super_admin' }
  }
}
