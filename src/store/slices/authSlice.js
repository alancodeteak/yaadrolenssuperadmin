import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { dashboardToast } from '../../utils/dashboardToast'
import authService from '../../services/authService'

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await authService.login(credentials)
      dashboardToast.success('Welcome back.', 'Signed in')
      return result
    } catch (error) {
      dashboardToast.error(error.message || 'Login failed. Please try again.', 'Sign in failed')
      return rejectWithValue(error.message)
    }
  }
)

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const newToken = await authService.refreshAccessToken()
      return newToken
    } catch (error) {
      dashboardToast.error('Session expired. Please sign in again.', 'Session expired')
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
      authService.clearTokenRefreshTimer()
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      dashboardToast.info('You have been signed out.', 'Logged out')
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
    },
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
        authService.setupTokenRefreshTimer()
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
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
