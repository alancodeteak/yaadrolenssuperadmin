import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Building2, 
  ArrowLeft, 
  Edit, 
  Trash2,
  Calendar, 
  Users, 
  MapPin, 
  DollarSign,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  fetchDepartmentDetails, 
  clearDepartmentDetails, 
  clearDepartmentDetailsError,
  openEditDepartmentModal,
  openDeleteDepartmentModal
} from '../store/slices/companiesSlice'
import PageHeader from '../components/common/PageHeader'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorAlert from '../components/common/ErrorAlert'
import DepartmentModal from '../components/common/DepartmentModal'
import DeleteDepartmentModal from '../components/department/DeleteDepartmentModal'

export default function DepartmentDetails() {
  const { departmentId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const { 
    departmentDetails, 
    isLoadingDepartmentDetails, 
    departmentDetailsError 
  } = useAppSelector(state => state.companies)

  useEffect(() => {
    if (departmentId) {
      dispatch(fetchDepartmentDetails(departmentId))
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearDepartmentDetails())
    }
  }, [dispatch, departmentId])

  const handleBack = () => {
    navigate('/departments')
  }

  const handleEdit = () => {
    if (departmentDetails) {
      dispatch(openEditDepartmentModal(departmentDetails))
    }
  }

  const handleDelete = () => {
    if (departmentDetails) {
      dispatch(openDeleteDepartmentModal(departmentDetails))
    }
  }

  const handleRefresh = () => {
    if (departmentId) {
      dispatch(fetchDepartmentDetails(departmentId))
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (isLoadingDepartmentDetails && !departmentDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner message="Loading department details..." />
        </div>
      </div>
    )
  }

  if (departmentDetailsError && !departmentDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <PageHeader
              title="Department Details"
              subtitle="View detailed information about the department"
              onBack={handleBack}
            />
            
            <ErrorAlert
              message={departmentDetailsError}
              type="error"
              onDismiss={() => dispatch(clearDepartmentDetailsError())}
            />
            
            <div className="flex justify-center">
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!departmentDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <PageHeader
              title="Department Details"
              subtitle="View detailed information about the department"
              onBack={handleBack}
            />
            
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Department not found</h3>
              <p className="text-gray-600">The requested department could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <PageHeader
            title="Department Details"
            subtitle="View detailed information about the department"
            onBack={handleBack}
          />

          {/* Error Alert */}
          {departmentDetailsError && (
            <ErrorAlert
              message={departmentDetailsError}
              type="error"
              onDismiss={() => dispatch(clearDepartmentDetailsError())}
            />
          )}

          {/* Department Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{departmentDetails.name}</h1>
                  <p className="text-gray-600">Department ID: {departmentDetails.id}</p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                    departmentDetails.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {departmentDetails.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={isLoadingDepartmentDetails}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingDepartmentDetails ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Department</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Department</span>
                </button>
              </div>
            </div>

            {departmentDetails.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-900 bg-gray-50 rounded-lg p-4">{departmentDetails.description}</p>
              </div>
            )}
          </div>

          {/* Department Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 text-purple-600 mr-2" />
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Department Name</span>
                  <span className="text-sm text-gray-900">{departmentDetails.name}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Department ID</span>
                  <span className="text-sm text-gray-900 font-mono">{departmentDetails.id}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    departmentDetails.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {departmentDetails.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {departmentDetails.location && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Location</span>
                    <span className="text-sm text-gray-900 flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      {departmentDetails.location}
                    </span>
                  </div>
                )}
                
                {departmentDetails.manager_name && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Manager</span>
                    <span className="text-sm text-gray-900 flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-1" />
                      {departmentDetails.manager_name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                Financial Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Annual Budget</span>
                  <span className="text-sm text-gray-900 font-semibold">
                    {formatCurrency(departmentDetails.budget)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Budget Status</span>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Currency</span>
                  <span className="text-sm text-gray-900">USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              Timeline Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Created Date</span>
                  <span className="text-sm text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                    {formatDate(departmentDetails.created_at)}
                  </span>
                </div>
                
                {departmentDetails.updated_at && departmentDetails.updated_at !== departmentDetails.created_at && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Last Updated</span>
                    <span className="text-sm text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      {formatDate(departmentDetails.updated_at)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Data Last Fetched</span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <RefreshCw className="w-4 h-4 text-gray-400 mr-1" />
                    {formatDate(new Date().toISOString())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Department Modal */}
      <DepartmentModal />
      
      {/* Delete Department Modal */}
      <DeleteDepartmentModal />
    </div>
  )
}
