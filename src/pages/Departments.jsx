import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Building2, RefreshCw, AlertCircle, Plus } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchDepartments, clearDepartmentsError, openCreateDepartmentModal, openEditDepartmentModal, openDeleteDepartmentModal } from '../store/slices/companiesSlice'
import DepartmentCard from '../components/DepartmentCard'
import DepartmentModal from '../components/common/DepartmentModal'
import DeleteDepartmentModal from '../components/department/DeleteDepartmentModal'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorAlert from '../components/common/ErrorAlert'
import SearchAndFilter from '../components/common/SearchAndFilter'

export default function Departments() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { 
    departments, 
    isLoadingDepartments, 
    departmentsError 
  } = useAppSelector(state => state.companies)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterActive, setFilterActive] = useState('all')

  useEffect(() => {
    // Fetch departments when component mounts
    dispatch(fetchDepartments(true)) // Fetch only active departments by default
  }, [dispatch])

  const handleViewDepartment = (department) => {
    navigate(`/departments/${department.id}`)
  }

  const handleEditDepartment = (department) => {
    dispatch(openEditDepartmentModal(department))
  }

  const handleDeleteDepartment = (department) => {
    dispatch(openDeleteDepartmentModal(department))
  }

  const handleRefresh = () => {
    dispatch(fetchDepartments(filterActive === 'active'))
    toast.success('Departments refreshed')
  }

  const handleAddDepartment = () => {
    dispatch(openCreateDepartmentModal())
  }

  const handleFilterChange = (filter) => {
    setFilterActive(filter)
    // Fetch departments based on filter
    if (filter === 'all') {
      dispatch(fetchDepartments(false)) // Fetch all departments
    } else {
      dispatch(fetchDepartments(true)) // Fetch only active departments
    }
  }

  // Filter departments based on search query and active status
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.manager_name?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' ? dept.is_active : !dept.is_active)
    
    return matchesSearch && matchesFilter
  })

  if (isLoadingDepartments && departments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <p className="text-gray-600">Manage department information and settings</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner message="Loading departments..." />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600">Manage department information and settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={isLoadingDepartments}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingDepartments ? 'animate-spin' : ''}`} />
            <span>{isLoadingDepartments ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button 
            onClick={handleAddDepartment}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        searchPlaceholder="Search departments..."
        filterValue={filterActive}
        onFilterChange={(e) => handleFilterChange(e.target.value)}
        filterOptions={[
          { value: 'all', label: 'All Departments' },
          { value: 'active', label: 'Active Only' },
          { value: 'inactive', label: 'Inactive Only' }
        ]}
        focusColor="focus:ring-purple-500"
      />

      {/* Results Count and Error Message */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredDepartments.length} of {departments.length} departments
        </p>
        {departmentsError && (
          <div className="flex items-center space-x-2 text-amber-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Showing cached data - API connection failed</span>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {departmentsError && (
        <ErrorAlert
          message={departmentsError}
          onClose={() => dispatch(clearDepartmentsError())}
        />
      )}

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map(department => (
          <DepartmentCard
            key={department.id}
            department={department}
            onView={handleViewDepartment}
            onEdit={handleEditDepartment}
            onDelete={handleDeleteDepartment}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredDepartments.length === 0 && !isLoadingDepartments && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Add your first department to get started.'}
          </p>
        </div>
      )}
      
      {/* Department Modal (Create/Edit) */}
      <DepartmentModal />
      
      {/* Delete Department Modal */}
      <DeleteDepartmentModal />
    </div>
  )
}
