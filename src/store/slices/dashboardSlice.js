import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  stats: {
    totalCompanies: 24,
    totalEmployees: 1247,
    totalAttendance: 1156,
    attendanceRate: 92.7
  },
  activities: [
    { action: 'New company registered', time: '2 minutes ago', icon: 'Building2' },
    { action: 'Attendance recorded', time: '5 minutes ago', icon: 'Clock' },
    { action: 'Report generated', time: '1 hour ago', icon: 'TrendingUp' },
    { action: 'User login', time: '2 hours ago', icon: 'Users' }
  ],
  isLoading: false,
  lastUpdated: null
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload }
      state.lastUpdated = new Date().toISOString()
    },
    updateActivities: (state, action) => {
      state.activities = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    refreshDashboard: (state) => {
      state.isLoading = true
      state.lastUpdated = new Date().toISOString()
    },
    refreshComplete: (state) => {
      state.isLoading = false
    },
    resetDashboard: (state) => {
      return initialState
    }
  }
})

export const {
  setLoading,
  updateStats,
  updateActivities,
  refreshDashboard,
  refreshComplete,
  resetDashboard
} = dashboardSlice.actions

export default dashboardSlice.reducer
