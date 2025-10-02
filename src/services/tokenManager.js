// Token management utility for JWT and refresh tokens
class TokenManager {
  constructor() {
    this.ACCESS_TOKEN_KEY = 'auth_token'
    this.REFRESH_TOKEN_KEY = 'refresh_token'
    this.USER_KEY = 'user_data'
  }

  // Store tokens and user data
  setTokens(accessToken, refreshToken, user = null) {
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
      if (refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
      }
      if (user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user))
      }
      return true
    } catch (error) {
      console.error('Error storing tokens:', error)
      return false
    }
  }

  // Get access token
  getAccessToken() {
    try {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY)
    } catch (error) {
      console.error('Error getting access token:', error)
      return null
    }
  }

  // Get refresh token
  getRefreshToken() {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    } catch (error) {
      console.error('Error getting refresh token:', error)
      return null
    }
  }

  // Get user data
  getUser() {
    try {
      const userData = localStorage.getItem(this.USER_KEY)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error getting user data:', error)
      return null
    }
  }

  // Check if access token is expired
  isAccessTokenExpired() {
    const token = this.getAccessToken()
    if (!token) return true

    try {
      // Decode JWT token (basic decoding without verification)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      
      // Check if token is expired (with 5 minute buffer)
      return payload.exp < (currentTime + 300)
    } catch (error) {
      console.error('Error checking token expiration:', error)
      return true
    }
  }

  // Check if refresh token is expired
  isRefreshTokenExpired() {
    const token = this.getRefreshToken()
    if (!token) return true

    try {
      // Decode JWT refresh token
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      
      // Check if refresh token is expired
      return payload.exp < currentTime
    } catch (error) {
      console.error('Error checking refresh token expiration:', error)
      return true
    }
  }

  // Check if user is authenticated (has valid tokens)
  isAuthenticated() {
    const hasAccessToken = !!this.getAccessToken()
    const hasRefreshToken = !!this.getRefreshToken()
    
    if (!hasAccessToken) return false
    
    // If access token is expired but refresh token is valid, we can still refresh
    if (this.isAccessTokenExpired()) {
      return !this.isRefreshTokenExpired()
    }
    
    return true
  }

  // Remove all tokens and user data
  clearTokens() {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
      return true
    } catch (error) {
      console.error('Error clearing tokens:', error)
      return false
    }
  }

  // Get token expiration time (for display purposes)
  getTokenExpirationTime() {
    const token = this.getAccessToken()
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return new Date(payload.exp * 1000)
    } catch (error) {
      console.error('Error getting token expiration:', error)
      return null
    }
  }

  // Get refresh token expiration time
  getRefreshTokenExpirationTime() {
    const token = this.getRefreshToken()
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return new Date(payload.exp * 1000)
    } catch (error) {
      console.error('Error getting refresh token expiration:', error)
      return null
    }
  }

  // Get time until token expires (in minutes)
  getTimeUntilExpiration() {
    const expTime = this.getTokenExpirationTime()
    if (!expTime) return 0

    const now = new Date()
    const diffMs = expTime.getTime() - now.getTime()
    return Math.max(0, Math.floor(diffMs / (1000 * 60)))
  }

  // Get time until refresh token expires (in minutes)
  getTimeUntilRefreshExpiration() {
    const expTime = this.getRefreshTokenExpirationTime()
    if (!expTime) return 0

    const now = new Date()
    const diffMs = expTime.getTime() - now.getTime()
    return Math.max(0, Math.floor(diffMs / (1000 * 60)))
  }
}

// Create singleton instance
const tokenManager = new TokenManager()

export default tokenManager
