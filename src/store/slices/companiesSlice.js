import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Debug logging
const debugLog = (message, data = null) => {
  if (import.meta.env.DEV) {
    console.log(`[COMPANIES DEBUG] ${message}`, data)
  }
}

// Async thunk for fetching shops
export const fetchShops = createAsyncThunk(
  'companies/fetchShops',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      debugLog('Fetching shops from API:', API_BASE_URL)
      
      const response = await axios.get(`${API_BASE_URL}/superadmin/shops/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      
      debugLog('Shops response received:', response.data)
      
      return response.data
    } catch (error) {
      debugLog('Error fetching shops:', error)
      
      let errorMessage = 'Failed to fetch shops'
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required'
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.'
      } else {
        errorMessage = error.response.data?.message || errorMessage
      }
      
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for fetching shop details
export const fetchShopDetails = createAsyncThunk(
  'companies/fetchShopDetails',
  async (shopId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      debugLog('API_BASE_URL:', API_BASE_URL)
      debugLog('Fetching shop details for ID:', shopId)
      debugLog('Full URL:', `${API_BASE_URL}/superadmin/shops/${shopId}`)
      debugLog('Token available:', !!token)
      
      if (!API_BASE_URL) {
        throw new Error('API_BASE_URL is not configured. Please check your .env file.')
      }
      
      if (!token) {
        throw new Error('Authentication token not found. Please login again.')
      }
      
      const response = await axios.get(`${API_BASE_URL}/superadmin/shops/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      
      debugLog('Shop details response received:', response.data)
      
      return response.data
    } catch (error) {
      debugLog('Error fetching shop details:', error)
      
      let errorMessage = 'Failed to fetch shop details'
      
      if (error.message === 'API_BASE_URL is not configured. Please check your .env file.') {
        errorMessage = 'API configuration error. Please check your environment variables.'
      } else if (error.message === 'Authentication token not found. Please login again.') {
        errorMessage = 'Authentication required. Please login again.'
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required'
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied'
      } else if (error.response?.status === 404) {
        errorMessage = 'Shop not found'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.'
      } else {
        errorMessage = error.response.data?.message || errorMessage
      }
      
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for creating a new shop
export const createShop = createAsyncThunk(
  'companies/createShop',
  async (shopData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      debugLog('Creating new shop with data:', JSON.stringify(shopData, null, 2))
      
      const response = await axios.post(`${API_BASE_URL}/superadmin/shops/`, shopData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      
      debugLog('Shop creation response received:', response.data)
      
      return response.data
    } catch (error) {
      debugLog('Error creating shop:', error)
      debugLog('Error response:', error.response?.data)
      debugLog('Error status:', error.response?.status)
      
      let errorMessage = 'Failed to create shop'
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required'
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied'
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid shop data provided'
      } else if (error.response?.status === 422) {
        // Handle validation errors
        const validationErrors = error.response.data
        if (validationErrors.detail) {
          errorMessage = `Validation Error: ${JSON.stringify(validationErrors.detail)}`
        } else if (validationErrors.message) {
          errorMessage = validationErrors.message
        } else {
          errorMessage = `Validation Error: ${JSON.stringify(validationErrors)}`
        }
      } else if (error.response?.status === 409) {
        errorMessage = 'Shop with this code already exists'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.'
      } else {
        errorMessage = error.response.data?.message || errorMessage
      }
      
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for updating a shop
export const updateShop = createAsyncThunk(
  'companies/updateShop',
  async ({ shopId, shopData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      debugLog('Updating shop with ID:', shopId, 'and data:', shopData)
      
      const response = await axios.put(`${API_BASE_URL}/superadmin/shops/${shopId}`, shopData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      
      debugLog('Shop update response received:', response.data)
      
      return { shopId, updatedShop: response.data }
    } catch (error) {
      debugLog('Error updating shop:', error)
      
      let errorMessage = 'Failed to update shop'
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required'
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied'
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid shop data provided'
      } else if (error.response?.status === 404) {
        errorMessage = 'Shop not found'
      } else if (error.response?.status === 409) {
        errorMessage = 'Shop with this code already exists'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.'
      } else {
        errorMessage = error.response.data?.message || errorMessage
      }
      
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for deleting a shop
export const deleteShop = createAsyncThunk(
  'companies/deleteShop',
  async (shopId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      debugLog('Deleting shop with ID:', shopId)
      
      const response = await axios.delete(`${API_BASE_URL}/superadmin/shops/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      
      debugLog('Shop deletion response received:', response.data)
      
      return shopId
    } catch (error) {
      debugLog('Error deleting shop:', error)
      
      let errorMessage = 'Failed to delete shop'
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required'
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied'
      } else if (error.response?.status === 404) {
        errorMessage = 'Shop not found'
      } else if (error.response?.status === 409) {
        errorMessage = 'Cannot delete shop with active employees or data'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.'
      } else {
        errorMessage = error.response.data?.message || errorMessage
      }
      
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for fetching shop analytics
export const fetchShopAnalytics = createAsyncThunk(
  'companies/fetchShopAnalytics',
  async (shopId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      debugLog('Fetching shop analytics for ID:', shopId)
      
      const response = await axios.get(`${API_BASE_URL}/superadmin/shops/${shopId}/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      
      debugLog('Shop analytics response received:', response.data)
      
      return response.data
    } catch (error) {
      debugLog('Error fetching shop analytics:', error)
      
      let errorMessage = 'Failed to fetch shop analytics'
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required'
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied'
      } else if (error.response?.status === 404) {
        errorMessage = 'Shop not found'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.'
      } else {
        errorMessage = error.response.data?.message || errorMessage
      }
      
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for fetching departments
export const fetchDepartments = createAsyncThunk(
  'companies/fetchDepartments',
  async (activeOnly = true, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      debugLog('Fetching departments with activeOnly:', activeOnly)
      
      const response = await axios.get(`${API_BASE_URL}/departments/?active_only=${activeOnly}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      
      debugLog('Departments response received:', response.data)
      
      return response.data
    } catch (error) {
      debugLog('Error fetching departments:', error)
      
      let errorMessage = 'Failed to fetch departments'
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required'
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.'
      } else {
        errorMessage = error.response.data?.message || errorMessage
      }
      
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for creating a department
export const createDepartment = createAsyncThunk(
  'companies/createDepartment',
  async (departmentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      debugLog('Creating department with data:', departmentData)
      
      const response = await axios.post(`${API_BASE_URL}/departments/`, departmentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      
      debugLog('Department creation response received:', response.data)
      
      return response.data
    } catch (error) {
      debugLog('Error creating department:', error)
      
      let errorMessage = 'Failed to create department'
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required'
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied'
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid department data provided'
      } else if (error.response?.status === 409) {
        errorMessage = 'Department with this name already exists'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.'
      } else {
        errorMessage = error.response.data?.message || errorMessage
      }
      
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for updating a department
export const updateDepartment = createAsyncThunk(
  'companies/updateDepartment',
  async ({ departmentId, departmentData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      debugLog('Updating department with ID:', departmentId, 'and data:', departmentData)
      
      const response = await axios.put(`${API_BASE_URL}/departments/${departmentId}`, departmentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      
      debugLog('Department update response received:', response.data)
      
      return response.data
    } catch (error) {
      debugLog('Error updating department:', error)
      
      let errorMessage = 'Failed to update department'
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required'
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied'
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid department data provided'
      } else if (error.response?.status === 404) {
        errorMessage = 'Department not found'
      } else if (error.response?.status === 409) {
        errorMessage = 'Department with this name already exists'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.'
      } else {
        errorMessage = error.response.data?.message || errorMessage
      }
      
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for fetching department details
export const fetchDepartmentDetails = createAsyncThunk(
  'companies/fetchDepartmentDetails',
  async (departmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      debugLog('Fetching department details for ID:', departmentId)
      
      const response = await axios.get(`${API_BASE_URL}/departments/${departmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      
      debugLog('Department details response received:', response.data)
      
      return response.data
    } catch (error) {
      debugLog('Error fetching department details:', error)
      
      let errorMessage = 'Failed to fetch department details'
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required'
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied'
      } else if (error.response?.status === 404) {
        errorMessage = 'Department not found'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.'
      } else {
        errorMessage = error.response.data?.message || errorMessage
      }
      
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for deleting a department
export const deleteDepartment = createAsyncThunk(
  'companies/deleteDepartment',
  async (departmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      debugLog('Deleting department with ID:', departmentId)
      
      const response = await axios.delete(`${API_BASE_URL}/departments/${departmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      
      debugLog('Department deletion response received:', response.data)
      
      return response.data
    } catch (error) {
      debugLog('Error deleting department:', error)
      
      let errorMessage = 'Failed to delete department'
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required'
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied'
      } else if (error.response?.status === 404) {
        errorMessage = 'Department not found'
      } else if (error.response?.status === 409) {
        errorMessage = 'Cannot delete department with active employees or positions'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.'
      } else {
        errorMessage = error.response.data?.message || errorMessage
      }
      
      return rejectWithValue(errorMessage)
    }
  }
)

const initialCompanies = [
  {
    id: 1,
    name: "TechCorp Solutions",
    industry: "Technology",
    location: "New York, NY",
    status: "active",
    employeeCount: 156,
    attendanceToday: 142,
    attendanceRate: 91.0,
    lastActivity: "2 hours ago"
  },
  {
    id: 2,
    name: "GreenEdge Manufacturing",
    industry: "Manufacturing",
    location: "Chicago, IL",
    status: "active",
    employeeCount: 89,
    attendanceToday: 82,
    attendanceRate: 92.1,
    lastActivity: "1 hour ago"
  },
  {
    id: 3,
    name: "Creative Agency Ltd",
    industry: "Marketing",
    location: "Los Angeles, CA",
    status: "active",
    employeeCount: 34,
    attendanceToday: 31,
    attendanceRate: 91.2,
    lastActivity: "3 hours ago"
  },
  {
    id: 4,
    name: "Global Services Inc",
    industry: "Consulting",
    location: "Boston, MA",
    status: "inactive",
    employeeCount: 67,
    attendanceToday: 0,
    attendanceRate: 85.5,
    lastActivity: "1 day ago"
  },
  {
    id: 5,
    name: "HealthFirst Medical",
    industry: "Healthcare",
    location: "Miami, FL",
    status: "active",
    employeeCount: 234,
    attendanceToday: 218,
    attendanceRate: 93.2,
    lastActivity: "30 minutes ago"
  }
]

const initialState = {
  companies: [],
  departments: [],
  searchQuery: '',
  filterStatus: 'all',
  selectedCompany: null,
  shopDetails: null,
  shopAnalytics: null,
  departmentDetails: null,
  isLoading: false,
  isLoadingDetails: false,
  isLoadingAnalytics: false,
  isLoadingDepartments: false,
  isLoadingDepartmentDetails: false,
  isCreating: false,
  isCreatingDepartment: false,
  isUpdatingDepartment: false,
  isDeletingDepartment: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  detailsError: null,
  analyticsError: null,
  departmentsError: null,
  departmentDetailsError: null,
  createError: null,
  createDepartmentError: null,
  updateDepartmentError: null,
  deleteDepartmentError: null,
  updateError: null,
  deleteError: null,
  total: 0,
  page: 1,
  size: 100,
  pages: 1,
  lastUpdated: null,
  createModalOpen: false,
  editModalOpen: false,
  editingShop: null,
  editDepartmentModalOpen: false,
  editingDepartment: null,
  deleteModalOpen: false,
  deletingShop: null,
  deleteDepartmentModalOpen: false,
  deletingDepartment: null,
  createDepartmentModalOpen: false
}

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload
    },
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload
    },
    updateCompany: (state, action) => {
      const { id, updates } = action.payload
      const index = state.companies.findIndex(company => company.id === id)
      if (index !== -1) {
        state.companies[index] = { ...state.companies[index], ...updates }
        state.lastUpdated = new Date().toISOString()
      }
    },
    addCompany: (state, action) => {
      const newCompany = {
        ...action.payload,
        id: Math.max(...state.companies.map(c => c.id)) + 1,
        lastActivity: 'Just now'
      }
      state.companies.push(newCompany)
      state.lastUpdated = new Date().toISOString()
    },
    deleteCompany: (state, action) => {
      state.companies = state.companies.filter(company => company.id !== action.payload)
      state.lastUpdated = new Date().toISOString()
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    resetCompanies: (state) => {
      return initialState
    },
    clearError: (state) => {
      state.error = null
    },
    clearShopDetails: (state) => {
      state.shopDetails = null
      state.detailsError = null
    },
    clearCreateError: (state) => {
      state.createError = null
    },
    clearUpdateError: (state) => {
      state.updateError = null
    },
    openEditModal: (state, action) => {
      state.editModalOpen = true
      state.editingShop = action.payload
    },
    closeEditModal: (state) => {
      state.editModalOpen = false
      state.editingShop = null
      state.updateError = null
    },
    openCreateModal: (state) => {
      state.createModalOpen = true
    },
    closeCreateModal: (state) => {
      state.createModalOpen = false
      state.createError = null
    },
    clearDeleteError: (state) => {
      state.deleteError = null
    },
    openDeleteModal: (state, action) => {
      state.deleteModalOpen = true
      state.deletingShop = action.payload
    },
    closeDeleteModal: (state) => {
      state.deleteModalOpen = false
      state.deletingShop = null
      state.deleteError = null
    },
    clearAnalyticsError: (state) => {
      state.analyticsError = null
    },
    clearDepartmentsError: (state) => {
      state.departmentsError = null
    },
    clearCreateDepartmentError: (state) => {
      state.createDepartmentError = null
    },
    openCreateDepartmentModal: (state) => {
      state.createDepartmentModalOpen = true
    },
    closeCreateDepartmentModal: (state) => {
      state.createDepartmentModalOpen = false
      state.createDepartmentError = null
    },
    clearUpdateDepartmentError: (state) => {
      state.updateDepartmentError = null
    },
    openEditDepartmentModal: (state, action) => {
      state.editDepartmentModalOpen = true
      state.editingDepartment = action.payload
    },
    closeEditDepartmentModal: (state) => {
      state.editDepartmentModalOpen = false
      state.editingDepartment = null
      state.updateDepartmentError = null
    },
    clearDepartmentDetails: (state) => {
      state.departmentDetails = null
      state.departmentDetailsError = null
    },
    clearDepartmentDetailsError: (state) => {
      state.departmentDetailsError = null
    },
    clearDeleteDepartmentError: (state) => {
      state.deleteDepartmentError = null
    },
    openDeleteDepartmentModal: (state, action) => {
      state.deleteDepartmentModalOpen = true
      state.deletingDepartment = action.payload
    },
    closeDeleteDepartmentModal: (state) => {
      state.deleteDepartmentModalOpen = false
      state.deletingDepartment = null
      state.deleteDepartmentError = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.isLoading = false
        state.companies = action.payload.items || []
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.size = action.payload.size || 100
        state.pages = action.payload.pages || 1
        state.error = null
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        // Fallback to demo data if API fails
        state.companies = initialCompanies
        state.total = initialCompanies.length
        state.page = 1
        state.size = 100
        state.pages = 1
      })
      .addCase(fetchShopDetails.pending, (state) => {
        state.isLoadingDetails = true
        state.detailsError = null
      })
      .addCase(fetchShopDetails.fulfilled, (state, action) => {
        state.isLoadingDetails = false
        state.shopDetails = action.payload
        state.detailsError = null
      })
      .addCase(fetchShopDetails.rejected, (state, action) => {
        state.isLoadingDetails = false
        state.detailsError = action.payload
        state.shopDetails = null
      })
      .addCase(createShop.pending, (state) => {
        state.isCreating = true
        state.createError = null
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.isCreating = false
        state.createError = null
        // Close create modal
        state.createModalOpen = false
        // Add the new shop to the companies list
        state.companies.unshift(action.payload)
        state.total += 1
      })
      .addCase(createShop.rejected, (state, action) => {
        state.isCreating = false
        state.createError = action.payload
      })
      .addCase(updateShop.pending, (state) => {
        state.isUpdating = true
        state.updateError = null
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        state.isUpdating = false
        state.updateError = null
        // Update the shop in the companies list
        const index = state.companies.findIndex(shop => shop.id === action.payload.shopId)
        if (index !== -1) {
          state.companies[index] = action.payload.updatedShop
        }
        // Update shop details if it's currently being viewed
        if (state.shopDetails && state.shopDetails.id === action.payload.shopId) {
          state.shopDetails = action.payload.updatedShop
        }
      })
      .addCase(updateShop.rejected, (state, action) => {
        state.isUpdating = false
        state.updateError = action.payload
      })
      .addCase(deleteShop.pending, (state) => {
        state.isDeleting = true
        state.deleteError = null
      })
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.isDeleting = false
        state.deleteError = null
        // Remove the shop from the companies list
        state.companies = state.companies.filter(shop => shop.id !== action.payload)
        state.total = Math.max(0, state.total - 1)
        // Close delete modal
        state.deleteModalOpen = false
        state.deletingShop = null
        // Clear shop details if it was the deleted shop
        if (state.shopDetails && state.shopDetails.id === action.payload) {
          state.shopDetails = null
        }
      })
      .addCase(deleteShop.rejected, (state, action) => {
        state.isDeleting = false
        state.deleteError = action.payload
      })
      .addCase(fetchShopAnalytics.pending, (state) => {
        state.isLoadingAnalytics = true
        state.analyticsError = null
      })
      .addCase(fetchShopAnalytics.fulfilled, (state, action) => {
        state.isLoadingAnalytics = false
        state.shopAnalytics = action.payload
        state.analyticsError = null
      })
      .addCase(fetchShopAnalytics.rejected, (state, action) => {
        state.isLoadingAnalytics = false
        state.analyticsError = action.payload
        state.shopAnalytics = null
      })
      .addCase(fetchDepartments.pending, (state) => {
        state.isLoadingDepartments = true
        state.departmentsError = null
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.isLoadingDepartments = false
        state.departments = action.payload
        state.departmentsError = null
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.isLoadingDepartments = false
        state.departmentsError = action.payload
        state.departments = []
      })
      .addCase(createDepartment.pending, (state) => {
        state.isCreatingDepartment = true
        state.createDepartmentError = null
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.isCreatingDepartment = false
        state.createDepartmentError = null
        // Add the new department to the departments list
        state.departments.unshift(action.payload)
        // Close create modal
        state.createDepartmentModalOpen = false
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.isCreatingDepartment = false
        state.createDepartmentError = action.payload
      })
      .addCase(updateDepartment.pending, (state) => {
        state.isUpdatingDepartment = true
        state.updateDepartmentError = null
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.isUpdatingDepartment = false
        state.updateDepartmentError = null
        // Update the department in the departments list
        const index = state.departments.findIndex(dept => dept.id === action.payload.id)
        if (index !== -1) {
          state.departments[index] = action.payload
        }
        // Close edit modal
        state.editDepartmentModalOpen = false
        state.editingDepartment = null
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.isUpdatingDepartment = false
        state.updateDepartmentError = action.payload
      })
      .addCase(fetchDepartmentDetails.pending, (state) => {
        state.isLoadingDepartmentDetails = true
        state.departmentDetailsError = null
      })
      .addCase(fetchDepartmentDetails.fulfilled, (state, action) => {
        state.isLoadingDepartmentDetails = false
        state.departmentDetails = action.payload
        state.departmentDetailsError = null
      })
      .addCase(fetchDepartmentDetails.rejected, (state, action) => {
        state.isLoadingDepartmentDetails = false
        state.departmentDetailsError = action.payload
        state.departmentDetails = null
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.isDeletingDepartment = true
        state.deleteDepartmentError = null
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.isDeletingDepartment = false
        state.deleteDepartmentError = null
        // Remove the deleted department from the departments list
        state.departments = state.departments.filter(dept => dept.id !== action.payload.deleted_id)
        // Close delete modal
        state.deleteDepartmentModalOpen = false
        state.deletingDepartment = null
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isDeletingDepartment = false
        state.deleteDepartmentError = action.payload
      })
  }
})

export const {
  setSearchQuery,
  setFilterStatus,
  setSelectedCompany,
  updateCompany,
  addCompany,
  deleteCompany,
  setLoading,
  resetCompanies,
  clearError,
  clearShopDetails,
  clearCreateError,
  clearUpdateError,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  clearDeleteError,
  openDeleteModal,
  closeDeleteModal,
  clearAnalyticsError,
  clearDepartmentsError,
  clearCreateDepartmentError,
  openCreateDepartmentModal,
  closeCreateDepartmentModal,
  clearUpdateDepartmentError,
  openEditDepartmentModal,
  closeEditDepartmentModal,
  clearDepartmentDetails,
  clearDepartmentDetailsError,
  clearDeleteDepartmentError,
  openDeleteDepartmentModal,
  closeDeleteDepartmentModal
} = companiesSlice.actions

// Selectors
export const selectFilteredCompanies = (state) => {
  const { companies, searchQuery, filterStatus } = state.companies
  
  return companies.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.shop_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' ? shop.is_active : !shop.is_active)
    return matchesSearch && matchesStatus
  })
}

export const selectCompanyById = (id) => (state) => {
  return state.companies.companies.find(company => company.id === id)
}

export default companiesSlice.reducer
