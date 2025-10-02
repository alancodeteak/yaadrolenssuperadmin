import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { deleteShop, closeDeleteModal, clearDeleteError } from '../../store/slices/companiesSlice'
import ConfirmationDialog from '../common/ConfirmationDialog'

export default function DeleteShopModal() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { 
    deleteModalOpen, 
    deletingShop, 
    isDeleting, 
    deleteError 
  } = useAppSelector(state => state.companies)

  const [confirmationText, setConfirmationText] = useState('')

  const handleConfirm = async () => {
    if (!deletingShop) return

    try {
      const result = await dispatch(deleteShop(deletingShop.id))
      
      if (deleteShop.fulfilled.match(result)) {
        toast.success(`Shop "${deletingShop.name}" has been deleted successfully!`)
        // Navigate to companies list if we're on the shop details page
        if (window.location.pathname.includes('/shops/')) {
          navigate('/companies')
        }
      } else {
        toast.error(result.payload || 'Failed to delete shop')
      }
    } catch (error) {
      console.error('Delete shop error:', error)
      toast.error('An unexpected error occurred')
    }
  }

  const handleClose = () => {
    setConfirmationText('')
    dispatch(closeDeleteModal())
  }

  if (!deletingShop) return null

  const isConfirmDisabled = confirmationText !== deletingShop.name || isDeleting

  return (
    <ConfirmationDialog
      isOpen={deleteModalOpen}
      onClose={handleClose}
      onConfirm={isConfirmDisabled ? undefined : handleConfirm}
      title="Delete Shop"
      message={
        <div className="space-y-3">
          <p>
            Are you sure you want to delete <strong>"{deletingShop.name}"</strong>? 
            This action cannot be undone.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium mb-2">
              ⚠️ This will permanently delete:
            </p>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Shop information and settings</li>
              <li>• All associated employee data</li>
              <li>• Attendance records and reports</li>
              <li>• All shop configurations</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              To confirm deletion, type the shop name below:
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Type "${deletingShop.name}" to confirm`}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                confirmationText && confirmationText !== deletingShop.name 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-red-500'
              }`}
              disabled={isDeleting}
            />
            {confirmationText && confirmationText !== deletingShop.name && (
              <p className="text-sm text-red-600">Shop name doesn't match</p>
            )}
          </div>

          {deleteError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{deleteError}</p>
            </div>
          )}
        </div>
      }
      confirmText="Delete Shop"
      cancelText="Cancel"
      type="danger"
      isLoading={isDeleting}
    />
  )
}
