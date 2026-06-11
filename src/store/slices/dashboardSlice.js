import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE_URL, getAuthHeaders, parseApiError } from '../../services/api'

export const fetchPlatformStats = createAsyncThunk(
  'dashboard/fetchPlatformStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/super-admin/stats`, {
        headers: getAuthHeaders(),
        timeout: 10000,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Failed to fetch dashboard stats'))
    }
  }
)

const initialState = {
  stats: {
    totalCompanies: 0,
    activeOrganizations: 0,
    totalEmployees: 0,
    totalAttendance: 0,
    attendanceRate: 0,
  },
  isLoading: false,
  error: null,
  lastUpdated: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatformStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPlatformStats.fulfilled, (state, action) => {
        const {
          organization_count,
          active_organization_count,
          total_employees,
          attendance_records_today,
        } = action.payload

        state.isLoading = false
        state.stats = {
          totalCompanies: organization_count,
          activeOrganizations: active_organization_count,
          totalEmployees: total_employees,
          totalAttendance: attendance_records_today,
          attendanceRate:
            total_employees > 0
              ? Number(((attendance_records_today / total_employees) * 100).toFixed(1))
              : 0,
        }
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchPlatformStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearDashboardError } = dashboardSlice.actions
export default dashboardSlice.reducer
