import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchShopDetails, clearShopDetails, openEditModal, openDeleteModal } from '../store/slices/companiesSlice'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorAlert from '../components/common/ErrorAlert'
import PageHeader from '../components/common/PageHeader'
import ShopInfoDisplay from '../components/shop/ShopInfoDisplay'
import ShopModal from '../components/common/ShopModal'
import DeleteShopModal from '../components/shop/DeleteShopModal'
import { Edit, RefreshCw, Trash2, BarChart3 } from 'lucide-react'

export default function ShopDetails() {
  const { shopId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { 
    shopDetails, 
    isLoadingDetails, 
    detailsError 
  } = useAppSelector(state => state.companies)

  useEffect(() => {
    if (shopId) {
      dispatch(fetchShopDetails(shopId))
    }

    // Cleanup function to clear shop details when component unmounts
    return () => {
      dispatch(clearShopDetails())
    }
  }, [dispatch, shopId])

  const handleRefresh = () => {
    if (shopId) {
      dispatch(fetchShopDetails(shopId))
      toast.success('Shop details refreshed')
    }
  }

  const handleEdit = () => {
    if (shopDetails) {
      dispatch(openEditModal(shopDetails))
    }
  }

  const handleDelete = () => {
    if (shopDetails) {
      dispatch(openDeleteModal(shopDetails))
    }
  }

  const handleAnalytics = () => {
    if (shopId) {
      navigate(`/shops/${shopId}/analytics`)
    }
  }

  const actions = (
    <>
      <button
        onClick={handleRefresh}
        disabled={isLoadingDetails}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300"
      >
        <RefreshCw className={`w-4 h-4 ${isLoadingDetails ? 'animate-spin' : ''}`} />
        <span>Refresh</span>
      </button>
      <button
        onClick={handleEdit}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Edit className="w-4 h-4" />
        <span>Edit Shop</span>
      </button>
      <button
        onClick={handleAnalytics}
        className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
      >
        <BarChart3 className="w-4 h-4" />
        <span>Analytics</span>
      </button>
      <button
        onClick={handleDelete}
        className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete Shop</span>
      </button>
    </>
  )

  if (isLoadingDetails && !shopDetails) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Loading Shop Details..."
          showBackButton={true}
        />
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="large" text="Loading shop details..." />
        </div>
      </div>
    )
  }

  if (detailsError && !shopDetails) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Shop Details"
          subtitle="Error loading shop information"
          showBackButton={true}
          actions={actions}
        />
        <ErrorAlert 
          message={detailsError}
          type="error"
        />
      </div>
    )
  }

  if (!shopDetails) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Shop Not Found"
          subtitle="The requested shop could not be found"
          showBackButton={true}
        />
        <ErrorAlert 
          message="Shop not found. Please check the shop ID and try again."
          type="error"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={shopDetails.name}
        subtitle={`Shop Code: ${shopDetails.shop_code}`}
        showBackButton={true}
        actions={actions}
      />
      
      {detailsError && (
        <ErrorAlert 
          message={`Warning: ${detailsError}. Showing cached data.`}
          type="warning"
          onDismiss={() => {
            // Clear the error
          }}
        />
      )}

      <ShopInfoDisplay shop={shopDetails} />
      
      {/* Edit Shop Modal */}
      <ShopModal />
      
      {/* Delete Shop Modal */}
      <DeleteShopModal />
    </div>
  )
}
