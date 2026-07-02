import { useState, useEffect } from 'react'
import { Layers } from 'lucide-react'
import { dashboardToast } from '../../utils/dashboardToast'
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

export default function DepartmentModal({ orgId }) {
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
    description: ''
  })

  const [errors, setErrors] = useState({})

  // Initialize form data
  useEffect(() => {
    if (isEdit && editingDepartment) {
      setFormData({
        name: editingDepartment.name || '',
        description: editingDepartment.description || ''
      })
    } else {
      setFormData({
        name: '',
        description: ''
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
      // Description is optional on the backend
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must be at most 500 characters'
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
          orgId,
          departmentId: editingDepartment.id,
          departmentData: {
            name: formData.name.trim(),
            description: formData.description.trim()
          }
        }))
      } else {
        result = await dispatch(createDepartment({
          orgId,
          departmentData: {
            name: formData.name.trim(),
            description: formData.description.trim()
          }
        }))
      }

      if ((isEdit ? updateDepartment : createDepartment).fulfilled.match(result)) {
        dashboardToast.success(
          `Department ${isEdit ? 'updated' : 'created'} successfully.`,
          isEdit ? 'Department updated' : 'Department created'
        )
      } else {
        dashboardToast.error(
          result.payload || `Failed to ${isEdit ? 'update' : 'create'} department`,
          'Request failed'
        )
      }
    } catch (error) {
      console.error(`${isEdit ? 'Update' : 'Create'} department error:`, error)
      dashboardToast.error('An unexpected error occurred', 'Request failed')
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
      subtitle={isEdit ? 'Update department details' : 'Add a department to this organization'}
      icon={Layers}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-3">
          <FormButton type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </FormButton>
          <FormButton type="submit" form="department-modal-form" loading={isLoading} disabled={isLoading}>
            {isEdit ? 'Update Department' : 'Create Department'}
          </FormButton>
        </div>
      }
    >
      <div className="space-y-4">
        {error && (
          <ErrorAlert 
            message={error}
            type="error"
            onDismiss={clearError}
          />
        )}

        <form id="department-modal-form" onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Optional department description"
              error={errors.description}
            />
          </div>

        </form>
      </div>
    </MinimalModal>
  )
}
