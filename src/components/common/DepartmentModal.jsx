import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { DollarSign } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { 
  createDepartment, 
  updateDepartment, 
  clearCreateDepartmentError, 
  clearUpdateDepartmentError,
  closeCreateDepartmentModal,
  closeEditDepartmentModal
} from '../../store/slices/companiesSlice'
import MinimalModal from './MinimalModal'
import FormInput from './FormInput'
import FormButton from './FormButton'
import ErrorAlert from './ErrorAlert'

export default function DepartmentModal() {
  const dispatch = useAppDispatch()
  const { 
    createDepartmentModalOpen,
    editDepartmentModalOpen,
    editingDepartment,
    isCreatingDepartment,
    isUpdatingDepartment,
    createDepartmentError,
    updateDepartmentError
  } = useAppSelector(state => state.companies)

  const isOpen = createDepartmentModalOpen || editDepartmentModalOpen
  const isEdit = !!editingDepartment
  const isLoading = isCreatingDepartment || isUpdatingDepartment
  const error = createDepartmentError || updateDepartmentError

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: ''
  })

  const [errors, setErrors] = useState({})

  // Initialize form data
  useEffect(() => {
    if (isEdit && editingDepartment) {
      setFormData({
        name: editingDepartment.name || '',
        description: editingDepartment.description || '',
        budget: editingDepartment.budget ? parseFloat(editingDepartment.budget).toFixed(2) : ''
      })
    } else {
      setFormData({
        name: '',
        description: '',
        budget: ''
      })
    }
    setErrors({})
  }, [isEdit, editingDepartment])

  const handleInputChange = (field) => (e) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
    
    // Clear global errors
    if (error) {
      if (createDepartmentError) dispatch(clearCreateDepartmentError())
      if (updateDepartmentError) dispatch(clearUpdateDepartmentError())
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Department name must be at least 3 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (!formData.budget) {
      newErrors.budget = 'Budget is required'
    } else {
      const budgetValue = parseFloat(formData.budget)
      if (isNaN(budgetValue) || budgetValue <= 0) {
        newErrors.budget = 'Budget must be a positive number'
      } else if (budgetValue > 10000000) {
        newErrors.budget = 'Budget cannot exceed $10,000,000'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      let result
      
      if (isEdit) {
        result = await dispatch(updateDepartment({
          departmentId: editingDepartment.id,
          departmentData: {
            name: formData.name.trim(),
            description: formData.description.trim(),
            budget: parseFloat(formData.budget)
          }
        }))
      } else {
        result = await dispatch(createDepartment({
          name: formData.name.trim(),
          description: formData.description.trim(),
          budget: parseFloat(formData.budget)
        }))
      }

      if ((isEdit ? updateDepartment : createDepartment).fulfilled.match(result)) {
        toast.success(`Department ${isEdit ? 'updated' : 'created'} successfully!`)
      } else {
        toast.error(result.payload || `Failed to ${isEdit ? 'update' : 'create'} department`)
      }
    } catch (error) {
      console.error(`${isEdit ? 'Update' : 'Create'} department error:`, error)
      toast.error('An unexpected error occurred')
    }
  }

  const handleClose = () => {
    if (createDepartmentModalOpen) {
      dispatch(closeCreateDepartmentModal())
    } else {
      dispatch(closeEditDepartmentModal())
    }
  }

  const clearError = () => {
    if (createDepartmentError) dispatch(clearCreateDepartmentError())
    if (updateDepartmentError) dispatch(clearUpdateDepartmentError())
  }

  return (
    <MinimalModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? 'Edit Department' : 'Create Department'}
      size="sm"
    >
      <div className="space-y-4">
        {error && (
          <ErrorAlert 
            message={error}
            type="error"
            onDismiss={clearError}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <FormInput
              label="Department Name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="Information Technology"
              error={errors.name}
              required
            />
            
            <FormInput
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange('description')}
              placeholder="Department description"
              error={errors.description}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Budget <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={handleInputChange('budget')}
                  placeholder="500000.00"
                  className={`w-full pl-9 pr-3 py-2 border ${
                    errors.budget ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:border-blue-500`}
                  disabled={isLoading}
                />
              </div>
              {errors.budget && (
                <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <FormButton
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </FormButton>
            <FormButton
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading 
                ? (isEdit ? 'Updating Department...' : 'Creating Department...') 
                : (isEdit ? 'Update Department' : 'Create Department')
              }
            </FormButton>
          </div>
        </form>
      </div>
    </MinimalModal>
  )
}
