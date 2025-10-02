import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authService from '../../services/authService'

// Debug logging
const debugLog = (message, data = null) => {
  if (import.meta.env.DEV) {
    console.log(`[AUTH DEBUG] ${message}`, data)
  }
}

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      debugLog('Attempting login with:', { email: credentials.email, password: '***' })
      
      const result = await authService.login(credentials)
      
      debugLog('Login successful:', { user: result.user })
      toast.success('Login successful! Welcome back.')
      
      return result
    } catch (error) {
      debugLog('Login error occurred:', error)
      
      // Check if this is a demo login (for testing without backend)
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123' && error.message.includes('Network')) {
        debugLog('Using demo login - backend not available')
        const demoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjYyMGUxZC03NWUxLTQ4Y2EtYTVlNy1hZTJjNDNiOTY5YjYiLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjo5OTk5OTk5OTk5fQ.demo'
        const demoRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjYyMGUxZC03NWUxLTQ4Y2EtYTVlNy1hZTJjNDNiOTY5YjYiLCJ0eXBlIjoicmVmcmVzaCIsImV4cCI6OTk5OTk5OTk5OX0.demo'
        const demoUser = {
          id: "76620e1d-75e1-48ca-a5e7-ae2c43b969b6",
          email: "admin@example.com",
          role: "admin",
          is_active: true,
          created_at: "2025-09-13T07:23:32.367184Z"
        }
        
        authService.setTokens(demoToken, demoRefreshToken, demoUser)
        debugLog('Demo login successful')
        toast.success('Demo login successful!')
        return { access_token: demoToken, refresh_token: demoRefreshToken, user: demoUser }
      }
      
      toast.error(error.message || 'Login failed. Please try again.')
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for refreshing access token
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      debugLog('Attempting to refresh access token')
      
      const newToken = await authService.refreshAccessToken()
      
      debugLog('Token refresh successful')
      return newToken
    } catch (error) {
      debugLog('Token refresh error:', error)
      toast.error('Session expired. Please login again.')
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  user: authService.getCurrentUser(),
  token: authService.getAccessToken(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout()
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      toast.info('You have been logged out.')
    },
    clearError: (state) => {
      state.error = null
    },
    checkAuth: (state) => {
      const isAuthenticated = authService.isAuthenticated()
      
      if (isAuthenticated) {
        state.token = authService.getAccessToken()
        state.user = authService.getCurrentUser()
        state.isAuthenticated = true
      } else {
        state.token = null
        state.user = null
        state.isAuthenticated = false
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.access_token
        state.isAuthenticated = true
        state.error = null
        
        // Setup automatic token refresh timer
        authService.setupTokenRefreshTimer()
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      .addCase(refreshAccessToken.pending, (state) => {
        // Don't set loading state for token refresh to avoid UI flicker
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError, checkAuth } = authSlice.actions
export default authSlice.reducer
