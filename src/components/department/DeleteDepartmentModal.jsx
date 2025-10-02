import { useState } from 'react'
import { toast } from 'react-toastify'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { deleteDepartment, closeDeleteDepartmentModal, clearDeleteDepartmentError } from '../../store/slices/companiesSlice'
import MinimalModal from '../common/MinimalModal'
import FormButton from '../common/FormButton'
import ErrorAlert from '../common/ErrorAlert'

export default function DeleteDepartmentModal() {
  const dispatch = useAppDispatch()
  const { 
    deleteDepartmentModalOpen, 
    deletingDepartment, 
    isDeletingDepartment, 
    deleteDepartmentError 
  } = useAppSelector(state => state.companies)

  const [confirmationText, setConfirmationText] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleInputChange = (e) => {
    const value = e.target.value
    setConfirmationText(value)
    
    // Check if the confirmation text matches the department name
    const matches = deletingDepartment && value === deletingDepartment.name
    setIsConfirmed(matches)
    
    // Clear delete error when user starts typing
    if (deleteDepartmentError) {
      dispatch(clearDeleteDepartmentError())
    }
  }

  const handleDelete = async () => {
    if (!isConfirmed || !deletingDepartment) {
      return
    }
    
    try {
      const result = await dispatch(deleteDepartment(deletingDepartment.id))
      
      if (deleteDepartment.fulfilled.match(result)) {
        toast.success(`Department "${deletingDepartment.name}" deleted successfully!`)
        
        // Show additional information if available
        if (result.payload.affected_positions > 0 || result.payload.affected_employees > 0) {
          toast.info(`This deletion affected ${result.payload.affected_positions} positions and ${result.payload.affected_employees} employees.`)
        }
      } else {
        toast.error(result.payload || 'Failed to delete department')
      }
    } catch (error) {
      console.error('Delete department error:', error)
      toast.error('An unexpected error occurred')
    }
  }

  const handleClose = () => {
    // Reset confirmation state when closing
    setConfirmationText('')
    setIsConfirmed(false)
    dispatch(closeDeleteDepartmentModal())
  }

  if (!deletingDepartment) return null

  return (
    <MinimalModal
      isOpen={deleteDepartmentModalOpen}
      onClose={handleClose}
      title="Delete Department"
      size="sm"
    >
      <div className="space-y-4">
        {deleteDepartmentError && (
          <ErrorAlert 
            message={deleteDepartmentError}
            type="error"
            onDismiss={() => dispatch(clearDeleteDepartmentError())}
          />
        )}

        {/* Warning Section */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-1">
                Warning: This action cannot be undone
              </h3>
              <p className="text-sm text-red-700">
                You are about to permanently delete the department <strong>"{deletingDepartment.name}"</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Section */}
        <div>
          <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-2">
            Type the department name to confirm deletion:
          </label>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-2">
            <p className="text-sm text-yellow-800">
              <strong>Department Name:</strong> <span className="font-mono">{deletingDepartment.name}</span>
            </p>
          </div>
          <input
            type="text"
            id="confirmation"
            value={confirmationText}
            onChange={handleInputChange}
            placeholder={`Type "${deletingDepartment.name}" to confirm`}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              confirmationText && !isConfirmed 
                ? 'border-red-500 bg-red-50' 
                : confirmationText && isConfirmed
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300'
            }`}
            disabled={isDeletingDepartment}
          />
          {confirmationText && !isConfirmed && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <X className="w-4 h-4 mr-1" />
              Department name does not match.
            </p>
          )}
          {confirmationText && isConfirmed && (
            <p className="mt-1 text-sm text-green-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Department name confirmed.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
          <FormButton
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isDeletingDepartment}
          >
            Cancel
          </FormButton>
          <FormButton
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={!isConfirmed || isDeletingDepartment}
            isLoading={isDeletingDepartment}
            loadingText="Deleting..."
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Department
          </FormButton>
        </div>
      </div>
    </MinimalModal>
  )
}
