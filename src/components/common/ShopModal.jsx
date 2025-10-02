import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { 
  createShop, 
  updateShop, 
  clearCreateError, 
  clearUpdateError,
  closeCreateModal,
  closeEditModal
} from '../../store/slices/companiesSlice'
import MinimalModal from './MinimalModal'
import FormInput from './FormInput'
import FormButton from './FormButton'
import ErrorAlert from './ErrorAlert'

export default function ShopModal() {
  const dispatch = useAppDispatch()
  const { 
    createModalOpen,
    editModalOpen,
    editingShop,
    isCreating,
    isUpdating,
    createError,
    updateError
  } = useAppSelector(state => state.companies)

  const isOpen = createModalOpen || editModalOpen
  const isEdit = !!editingShop
  const isLoading = isCreating || isUpdating
  const error = createError || updateError

  const [formData, setFormData] = useState({
    name: '',
    shop_code: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    timezone: 'UTC',
    currency: 'USD',
    is_active: true,
    max_employees: '',
    max_payroll_budget: '',
    ml_training_limit: ''
  })

  const [errors, setErrors] = useState({})

  // Initialize form data
  useEffect(() => {
    if (isEdit && editingShop) {
      setFormData({
        name: editingShop.name || '',
        shop_code: editingShop.shop_code || '',
        description: editingShop.description || '',
        address: editingShop.address || '',
        phone: editingShop.phone || '',
        email: editingShop.email || '',
        timezone: editingShop.timezone || 'UTC',
        currency: editingShop.currency || 'USD',
        is_active: editingShop.is_active ?? true,
        max_employees: editingShop.max_employees || '',
        max_payroll_budget: editingShop.max_payroll_budget || '',
        ml_training_limit: editingShop.ml_training_limit || ''
      })
    } else {
      setFormData({
        name: '',
        shop_code: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        timezone: 'UTC',
        currency: 'USD',
        is_active: true,
        max_employees: '',
        max_payroll_budget: '',
        ml_training_limit: ''
      })
    }
    setErrors({})
  }, [isEdit, editingShop])

  const handleInputChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
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
      if (createError) dispatch(clearCreateError())
      if (updateError) dispatch(clearUpdateError())
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Shop name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Shop name must be at least 2 characters'
    }

    if (!formData.shop_code.trim()) {
      newErrors.shop_code = 'Shop code is required'
    } else if (formData.shop_code.trim().length < 2) {
      newErrors.shop_code = 'Shop code must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Numeric fields
    if (formData.max_employees && (isNaN(formData.max_employees) || formData.max_employees <= 0)) {
      newErrors.max_employees = 'Max employees must be a positive number'
    }

    if (formData.max_payroll_budget && (isNaN(formData.max_payroll_budget) || formData.max_payroll_budget <= 0)) {
      newErrors.max_payroll_budget = 'Max payroll budget must be a positive number'
    }

    if (formData.ml_training_limit && (isNaN(formData.ml_training_limit) || formData.ml_training_limit <= 0)) {
      newErrors.ml_training_limit = 'ML training limit must be a positive number'
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
        result = await dispatch(updateShop({
          shopId: editingShop.id,
          shopData: {
            name: formData.name.trim(),
            shop_code: formData.shop_code.trim(),
            description: formData.description.trim(),
            address: formData.address.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            timezone: formData.timezone,
            currency: formData.currency,
            is_active: formData.is_active,
            max_employees: formData.max_employees ? parseInt(formData.max_employees) : null,
            max_payroll_budget: formData.max_payroll_budget || null,
            ml_training_limit: formData.ml_training_limit ? parseInt(formData.ml_training_limit) : null
          }
        }))
      } else {
        result = await dispatch(createShop({
          name: formData.name.trim(),
          shop_code: formData.shop_code.trim(),
          description: formData.description.trim(),
          address: formData.address.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          timezone: formData.timezone,
          currency: formData.currency,
          is_active: formData.is_active,
          max_employees: formData.max_employees ? parseInt(formData.max_employees) : null,
          max_payroll_budget: formData.max_payroll_budget || null,
          ml_training_limit: formData.ml_training_limit ? parseInt(formData.ml_training_limit) : null
        }))
      }

      if ((isEdit ? updateShop : createShop).fulfilled.match(result)) {
        toast.success(`Shop ${isEdit ? 'updated' : 'created'} successfully!`)
      } else {
        toast.error(result.payload || `Failed to ${isEdit ? 'update' : 'create'} shop`)
      }
    } catch (error) {
      console.error(`${isEdit ? 'Update' : 'Create'} shop error:`, error)
      toast.error('An unexpected error occurred')
    }
  }

  const handleClose = () => {
    if (createModalOpen) {
      dispatch(closeCreateModal())
    } else {
      dispatch(closeEditModal())
    }
  }

  const clearError = () => {
    if (createError) dispatch(clearCreateError())
    if (updateError) dispatch(clearUpdateError())
  }

  return (
    <MinimalModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? 'Edit Shop' : 'Create Shop'}
      size="md"
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
          {/* Basic Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Basic Information</h4>
            <div className="space-y-3">
              <FormInput
                label="Shop Name"
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                placeholder="Main Branch"
                error={errors.name}
                required
              />
              <FormInput
                label="Shop Code"
                type="text"
                value={formData.shop_code}
                onChange={handleInputChange('shop_code')}
                placeholder="SHOP001"
                error={errors.shop_code}
                required
              />
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="shop@company.com"
                error={errors.email}
                required
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Settings</h4>
            <div className="space-y-3">
              <FormInput
                label="Max Employees"
                type="number"
                value={formData.max_employees}
                onChange={handleInputChange('max_employees')}
                placeholder="50"
                error={errors.max_employees}
                min="0"
                max="10000"
              />
              <FormInput
                label="Budget"
                type="text"
                value={formData.max_payroll_budget}
                onChange={handleInputChange('max_payroll_budget')}
                placeholder="25000.00"
                error={errors.max_payroll_budget}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange('is_active')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm text-gray-900">
                  Active
                </label>
              </div>
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
                ? (isEdit ? 'Updating Shop...' : 'Creating Shop...') 
                : (isEdit ? 'Update Shop' : 'Create Shop')
              }
            </FormButton>
          </div>
        </form>
      </div>
    </MinimalModal>
  )
}
