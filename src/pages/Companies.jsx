import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Plus, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setSearchQuery, setFilterStatus, selectFilteredCompanies, fetchShops, openEditModal, openDeleteModal, openCreateModal } from '../store/slices/companiesSlice'
import CompanyCard from '../components/CompanyCard'
import ShopModal from '../components/common/ShopModal'
import DeleteShopModal from '../components/shop/DeleteShopModal'
import SearchAndFilter from '../components/common/SearchAndFilter'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Companies() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { searchQuery, filterStatus, isLoading, error, total } = useAppSelector(state => state.companies)
  const filteredCompanies = useAppSelector(selectFilteredCompanies)

  useEffect(() => {
    // Fetch shops when component mounts
    dispatch(fetchShops())
  }, [dispatch])

  const handleViewCompany = (company) => {
    console.log('View company:', company.name)
    // Navigate to company details or open modal
  }

  const handleEditCompany = (company) => {
    dispatch(openEditModal(company))
  }

  const handleDeleteCompany = (company) => {
    dispatch(openDeleteModal(company))
  }

  const handleRefresh = () => {
    dispatch(fetchShops())
  }

  const handleAddShop = () => {
    dispatch(openCreateModal())
  }

  if (isLoading && filteredCompanies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner 
          text="Loading shops..." 
          size="default"
        />
      </div>
    )
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shops</h1>
          <p className="text-gray-600">Manage shop information and settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300"
          >
            <Building2 className="w-4 h-4" />
            <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button 
            onClick={handleAddShop}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shop</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={(e) => dispatch(setSearchQuery(e.target.value))}
        searchPlaceholder="Search shops..."
        filterValue={filterStatus}
        onFilterChange={(e) => dispatch(setFilterStatus(e.target.value))}
        filterOptions={[
          { value: 'all', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ]}
        focusColor="focus:ring-blue-500"
      />

      {/* Results Count and Error Message */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredCompanies.length} of {total} shops
        </p>
        {error && (
          <div className="flex items-center space-x-2 text-amber-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Showing demo data - API connection failed</span>
          </div>
        )}
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map(company => (
          <CompanyCard
            key={company.id}
            company={company}
            onView={handleViewCompany}
            onEdit={handleEditCompany}
            onDelete={handleDeleteCompany}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCompanies.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No shops found</h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Add your first shop to get started.'}
          </p>
        </div>
      )}

      {/* Shop Modal (Create/Edit) */}
      <ShopModal />
      
      {/* Delete Shop Modal */}
      <DeleteShopModal />
    </div>
  )
}

