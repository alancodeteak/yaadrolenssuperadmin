import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE_URL, getAuthHeaders, parseApiError } from '../../services/api'
import { normalizeOrganization } from '../../utils/normalizeOrganization'

const getRequestConfig = () => ({ headers: getAuthHeaders(), timeout: 10000 })

async function fetchOrganizationsWithStats() {
  const orgsResponse = await axios.get(
    `${API_BASE_URL}/super-admin/organizations`,
    getRequestConfig()
  )

  let statsById = {}
  try {
    const statsResponse = await axios.get(
      `${API_BASE_URL}/super-admin/organizations/stats`,
      getRequestConfig()
    )
    statsById = Object.fromEntries(
      statsResponse.data.map((item) => [item.organization_id, item])
    )
  } catch {
    // Stats are optional — org list should still load if stats endpoint fails
  }

  return orgsResponse.data.map((org) =>
    normalizeOrganization({
      ...org,
      employee_count: statsById[org.id]?.employee_count ?? 0,
    })
  )
}

export const fetchOrganizations = createAsyncThunk(
  'companies/fetchOrganizations',
  async (_, { rejectWithValue }) => {
    try {
      const organizations = await fetchOrganizationsWithStats()
      return { items: organizations, total: organizations.length }
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Failed to fetch organizations'))
    }
  }
)

export const fetchShops = fetchOrganizations

export const fetchShopDetails = createAsyncThunk(
  'companies/fetchShopDetails',
  async (orgId, { getState, rejectWithValue }) => {
    try {
      const cached = getState().companies.companies.find(
        (org) => String(org.id) === String(orgId)
      )
      const response = await axios.get(
        `${API_BASE_URL}/super-admin/organizations/${orgId}`,
        getRequestConfig()
      )
      return normalizeOrganization({
        ...response.data,
        employee_count: cached?.employee_count ?? 0,
      })
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Organization not found'))
    }
  }
)

export const fetchFaceMatchingSettings = createAsyncThunk(
  'companies/fetchFaceMatchingSettings',
  async (orgId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/super-admin/organizations/${orgId}/settings/face-matching`,
        getRequestConfig()
      )
      return response.data
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Failed to fetch face matching settings'))
    }
  }
)

export const updateFaceMatchingSettings = createAsyncThunk(
  'companies/updateFaceMatchingSettings',
  async ({ orgId, similarity_threshold, ambiguity_gap }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/super-admin/organizations/${orgId}/settings/face-matching`,
        { similarity_threshold, ambiguity_gap },
        getRequestConfig()
      )
      return response.data
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Failed to update face matching settings'))
    }
  }
)

export const createShop = createAsyncThunk(
  'companies/createShop',
  async (orgData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/super-admin/organizations`,
        orgData,
        getRequestConfig()
      )
      return normalizeOrganization({ ...response.data, employee_count: 0 })
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Failed to create organization'))
    }
  }
)

export const updateShop = createAsyncThunk(
  'companies/updateShop',
  async ({ shopId, shopData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/super-admin/organizations/${shopId}`,
        shopData,
        getRequestConfig()
      )
      return { shopId, updatedShop: normalizeOrganization(response.data) }
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Failed to update organization'))
    }
  }
)

export const deleteShop = createAsyncThunk(
  'companies/deleteShop',
  async (orgId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/super-admin/organizations/${orgId}/disable`,
        {},
        getRequestConfig()
      )
      return normalizeOrganization(response.data)
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Failed to disable organization'))
    }
  }
)

export const fetchDepartments = createAsyncThunk(
  'companies/fetchDepartments',
  async ({ orgId, activeOnly = false }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/super-admin/organizations/${orgId}/departments`,
        {
          ...getRequestConfig(),
          params: { active_only: activeOnly },
        }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Failed to fetch departments'))
    }
  }
)

export const fetchDepartmentDetails = createAsyncThunk(
  'companies/fetchDepartmentDetails',
  async ({ orgId, departmentId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/super-admin/organizations/${orgId}/departments/${departmentId}`,
        getRequestConfig()
      )
      return response.data
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Failed to fetch department details'))
    }
  }
)

export const createDepartment = createAsyncThunk(
  'companies/createDepartment',
  async ({ orgId, departmentData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/super-admin/organizations/${orgId}/departments`,
        departmentData,
        getRequestConfig()
      )
      return response.data
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Failed to create department'))
    }
  }
)

export const updateDepartment = createAsyncThunk(
  'companies/updateDepartment',
  async ({ orgId, departmentId, departmentData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/super-admin/organizations/${orgId}/departments/${departmentId}`,
        departmentData,
        getRequestConfig()
      )
      return response.data
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Failed to update department'))
    }
  }
)

export const deleteDepartment = createAsyncThunk(
  'companies/deleteDepartment',
  async ({ orgId, departmentId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/super-admin/organizations/${orgId}/departments/${departmentId}/deactivate`,
        {},
        getRequestConfig()
      )
      return response.data
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Failed to deactivate department'))
    }
  }
)

export const fetchShopAnalytics = createAsyncThunk(
  'companies/fetchShopAnalytics',
  async (orgId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/super-admin/organizations/stats`,
        getRequestConfig()
      )
      const stat = response.data.find(
        (item) => String(item.organization_id) === String(orgId)
      )

      if (!stat) {
        return rejectWithValue('Organization stats not found')
      }

      return {
        shop: {
          name: stat.organization_name,
          shop_code: stat.organization_code,
          code: stat.organization_code,
        },
        total_employees: stat.employee_count,
        active_employees: stat.status === 'active' ? stat.employee_count : 0,
        period_days: 30,
        analytics: [],
      }
    } catch (error) {
      return rejectWithValue(parseApiError(error, 'Failed to fetch organization stats'))
    }
  }
)

const initialState = {
  companies: [],
  searchQuery: '',
  filterStatus: 'all',
  selectedCompany: null,
  shopDetails: null,
  shopAnalytics: null,
  isLoading: false,
  isLoadingDetails: false,
  isLoadingAnalytics: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  detailsError: null,
  analyticsError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  total: 0,
  lastUpdated: null,
  createModalOpen: false,
  editModalOpen: false,
  editingShop: null,
  deleteModalOpen: false,
  deletingShop: null,
  departments: [],
  isLoadingDepartments: false,
  departmentsError: null,
  departmentDetails: null,
  isLoadingDepartmentDetails: false,
  departmentDetailsError: null,
  createDepartmentModalOpen: false,
  editDepartmentModalOpen: false,
  editingDepartment: null,
  isCreatingDepartment: false,
  isUpdatingDepartment: false,
  createDepartmentError: null,
  updateDepartmentError: null,
  deleteDepartmentModalOpen: false,
  deletingDepartment: null,
  isDeletingDepartment: false,
  deleteDepartmentError: null,
  faceMatchingSettings: null,
  isLoadingFaceMatching: false,
  isUpdatingFaceMatching: false,
  faceMatchingError: null,
  updateFaceMatchingError: null,
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
    clearError: (state) => {
      state.error = null
    },
    clearShopDetails: (state) => {
      state.shopDetails = null
      state.detailsError = null
      state.faceMatchingSettings = null
      state.faceMatchingError = null
      state.updateFaceMatchingError = null
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
    clearDepartmentDetails: (state) => {
      state.departmentDetails = null
      state.departmentDetailsError = null
    },
    clearDepartmentDetailsError: (state) => {
      state.departmentDetailsError = null
    },
    openCreateDepartmentModal: (state) => {
      state.createDepartmentModalOpen = true
    },
    closeCreateDepartmentModal: (state) => {
      state.createDepartmentModalOpen = false
      state.createDepartmentError = null
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
    clearCreateDepartmentError: (state) => {
      state.createDepartmentError = null
    },
    clearUpdateDepartmentError: (state) => {
      state.updateDepartmentError = null
    },
    openDeleteDepartmentModal: (state, action) => {
      state.deleteDepartmentModalOpen = true
      state.deletingDepartment = action.payload
    },
    closeDeleteDepartmentModal: (state) => {
      state.deleteDepartmentModalOpen = false
      state.deletingDepartment = null
      state.deleteDepartmentError = null
    },
    clearDeleteDepartmentError: (state) => {
      state.deleteDepartmentError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.isLoading = false
        state.companies = action.payload.items
        state.total = action.payload.total
        state.error = null
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.companies = []
        state.total = 0
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
      .addCase(fetchFaceMatchingSettings.pending, (state) => {
        state.isLoadingFaceMatching = true
        state.faceMatchingError = null
      })
      .addCase(fetchFaceMatchingSettings.fulfilled, (state, action) => {
        state.isLoadingFaceMatching = false
        if (String(action.payload?.organization_id) === String(action.meta.arg)) {
          state.faceMatchingSettings = action.payload
        }
        state.faceMatchingError = null
      })
      .addCase(fetchFaceMatchingSettings.rejected, (state, action) => {
        state.isLoadingFaceMatching = false
        state.faceMatchingError = action.payload
        state.faceMatchingSettings = null
      })
      .addCase(updateFaceMatchingSettings.pending, (state) => {
        state.isUpdatingFaceMatching = true
        state.updateFaceMatchingError = null
      })
      .addCase(updateFaceMatchingSettings.fulfilled, (state, action) => {
        state.isUpdatingFaceMatching = false
        state.faceMatchingSettings = action.payload
        state.updateFaceMatchingError = null
      })
      .addCase(updateFaceMatchingSettings.rejected, (state, action) => {
        state.isUpdatingFaceMatching = false
        state.updateFaceMatchingError = action.payload
      })
      .addCase(createShop.pending, (state) => {
        state.isCreating = true
        state.createError = null
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.isCreating = false
        state.createError = null
        state.createModalOpen = false
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
        state.editModalOpen = false
        state.editingShop = null

        const index = state.companies.findIndex(
          (org) => String(org.id) === String(action.payload.shopId)
        )
        if (index !== -1) {
          state.companies[index] = {
            ...state.companies[index],
            ...action.payload.updatedShop,
          }
        }
        if (state.shopDetails && String(state.shopDetails.id) === String(action.payload.shopId)) {
          state.shopDetails = {
            ...state.shopDetails,
            ...action.payload.updatedShop,
          }
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
        state.deleteModalOpen = false
        state.deletingShop = null

        const index = state.companies.findIndex(
          (org) => String(org.id) === String(action.payload.id)
        )
        if (index !== -1) {
          state.companies[index] = {
            ...state.companies[index],
            status: 'inactive',
          }
        }
        if (state.shopDetails && String(state.shopDetails.id) === String(action.payload.id)) {
          state.shopDetails = {
            ...state.shopDetails,
            status: 'inactive',
          }
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
      .addCase(fetchDepartmentDetails.pending, (state) => {
        state.isLoadingDepartmentDetails = true
        state.departmentDetailsError = null
      })
      .addCase(fetchDepartmentDetails.fulfilled, (state, action) => {
        state.isLoadingDepartmentDetails = false
        state.departmentDetails = action.payload
      })
      .addCase(fetchDepartmentDetails.rejected, (state, action) => {
        state.isLoadingDepartmentDetails = false
        state.departmentDetailsError = action.payload
        state.departmentDetails = null
      })
      .addCase(createDepartment.pending, (state) => {
        state.isCreatingDepartment = true
        state.createDepartmentError = null
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.isCreatingDepartment = false
        state.createDepartmentModalOpen = false
        state.departments.unshift(action.payload)
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
        state.editDepartmentModalOpen = false
        state.editingDepartment = null
        const index = state.departments.findIndex((d) => d.id === action.payload.id)
        if (index !== -1) state.departments[index] = action.payload
        if (state.departmentDetails?.id === action.payload.id) {
          state.departmentDetails = action.payload
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.isUpdatingDepartment = false
        state.updateDepartmentError = action.payload
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.isDeletingDepartment = true
        state.deleteDepartmentError = null
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.isDeletingDepartment = false
        state.deleteDepartmentModalOpen = false
        state.deletingDepartment = null
        const index = state.departments.findIndex((d) => d.id === action.payload.id)
        if (index !== -1) state.departments[index] = action.payload
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isDeletingDepartment = false
        state.deleteDepartmentError = action.payload
      })
  },
})

export const {
  setSearchQuery,
  setFilterStatus,
  setSelectedCompany,
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
  clearDepartmentDetails,
  clearDepartmentDetailsError,
  openCreateDepartmentModal,
  closeCreateDepartmentModal,
  openEditDepartmentModal,
  closeEditDepartmentModal,
  clearCreateDepartmentError,
  clearUpdateDepartmentError,
  openDeleteDepartmentModal,
  closeDeleteDepartmentModal,
  clearDeleteDepartmentError,
} = companiesSlice.actions

export const selectFilteredCompanies = (state) => {
  const { companies, searchQuery, filterStatus } = state.companies

  return companies.filter((org) => {
    const code = org.code || org.shop_code || ''
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.toLowerCase().includes(searchQuery.toLowerCase())
    const isActive = org.status === 'active'
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' ? isActive : !isActive)
    return matchesSearch && matchesStatus
  })
}

export default companiesSlice.reducer
