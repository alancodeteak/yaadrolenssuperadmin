import axios from 'axios'
import tokenManager from './tokenManager'
import { API_BASE_URL, buildUserFromToken } from './api'

class AuthService {
  constructor() {
    this.isRefreshing = false
    this.failedQueue = []
    
    // Setup axios interceptor for automatic token refresh
    this.setupAxiosInterceptors()
  }

  // Setup axios interceptors for automatic token refresh
  setupAxiosInterceptors() {
    // Request interceptor to add token to requests
    axios.interceptors.request.use(
      (config) => {
        const token = tokenManager.getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle token refresh
    axios.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        const originalRequest = error.config

        // If error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If we're already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return axios(originalRequest)
            }).catch(err => {
              return Promise.reject(err)
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const newToken = await this.refreshAccessToken()
            this.processQueue(null, newToken)
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return axios(originalRequest)
          } catch (refreshError) {
            this.processQueue(refreshError, null)
            this.logout()
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // Process queued requests after token refresh
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })
    
    this.failedQueue = []
  }

  async login(credentials) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/super-admin/auth/login`,
        {
          login_id: credentials.login_id,
          password: credentials.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      )

      const { access_token, refresh_token } = response.data
      const user = buildUserFromToken(access_token, credentials.login_id)

      tokenManager.setTokens(access_token, refresh_token, user)

      return { user, access_token, refresh_token }
    } catch (error) {
      console.error('Login error:', error)
      const detail = error.response?.data?.detail
      const message = typeof detail === 'string' ? detail : 'Login failed'
      throw new Error(message)
    }
  }

  // Refresh access token using refresh token
  async refreshAccessToken() {
    try {
      const refreshToken = tokenManager.getRefreshToken()
      
      if (!refreshToken || tokenManager.isRefreshTokenExpired()) {
        throw new Error('Refresh token is invalid or expired')
      }

      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })

      const { access_token, refresh_token } = response.data

      // Update stored tokens
      const user = tokenManager.getUser()
      tokenManager.setTokens(access_token, refresh_token, user)

      return access_token
    } catch (error) {
      console.error('Token refresh error:', error)
      throw new Error('Failed to refresh access token')
    }
  }

  async logout() {
    tokenManager.clearTokens()
  }

  // Check if user is authenticated
  isAuthenticated() {
    return tokenManager.isAuthenticated()
  }

  // Check if access token is expired
  isAccessTokenExpired() {
    return tokenManager.isAccessTokenExpired()
  }

  // Check if refresh token is expired
  isRefreshTokenExpired() {
    return tokenManager.isRefreshTokenExpired()
  }

  // Get current user
  getCurrentUser() {
    return tokenManager.getUser()
  }

  // Get access token
  getAccessToken() {
    return tokenManager.getAccessToken()
  }

  // Get refresh token
  getRefreshToken() {
    return tokenManager.getRefreshToken()
  }

  // Get token expiration info
  getTokenInfo() {
    return {
      accessTokenExpiry: tokenManager.getTokenExpirationTime(),
      refreshTokenExpiry: tokenManager.getRefreshTokenExpirationTime(),
      minutesUntilExpiry: tokenManager.getTimeUntilExpiration(),
      minutesUntilRefreshExpiry: tokenManager.getTimeUntilRefreshExpiration(),
      isAccessTokenExpired: tokenManager.isAccessTokenExpired(),
      isRefreshTokenExpired: tokenManager.isRefreshTokenExpired()
    }
  }

  // Proactive token refresh (call before token expires)
  async proactiveRefresh() {
    const minutesUntilExpiry = tokenManager.getTimeUntilExpiration()
    
    // Refresh if token expires in less than 5 minutes
    if (minutesUntilExpiry <= 5 && minutesUntilExpiry > 0) {
      try {
        await this.refreshAccessToken()
        console.log('Token refreshed proactively')
        return true
      } catch (error) {
        console.error('Proactive refresh failed:', error)
        return false
      }
    }
    
    return true
  }

  // Setup automatic token refresh timer
  setupTokenRefreshTimer() {
    // Clear existing timer
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }

    // Check token status every minute
    this.refreshTimer = setInterval(() => {
      if (this.isAuthenticated()) {
        this.proactiveRefresh()
      } else {
        // Clear timer if not authenticated
        clearInterval(this.refreshTimer)
      }
    }, 60000) // Check every minute
  }

  // Clear token refresh timer
  clearTokenRefreshTimer() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
  }
}

// Create singleton instance
const authService = new AuthService()

export default authService
