import { useState, useEffect } from 'react'
import { Building2 } from 'lucide-react'
import { dashboardToast } from '../../utils/dashboardToast'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createShop,
  updateShop,
  clearCreateError,
  clearUpdateError,
  closeCreateModal,
  closeEditModal,
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
    updateError,
  } = useAppSelector(state => state.companies)

  const isOpen = createModalOpen || editModalOpen
  const isEdit = !!editingShop
  const isLoading = isCreating || isUpdating
  const error = createError || updateError

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    admin_login_id: '',
    admin_password: '',
    admin_name: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editModalOpen && editingShop) {
      setFormData({
        name: editingShop.name || '',
        code: editingShop.code || editingShop.shop_code || '',
        admin_login_id: '',
        admin_password: '',
        admin_name: '',
      })
    } else {
      setFormData({
        name: '',
        code: '',
        admin_login_id: '',
        admin_password: '',
        admin_name: '',
      })
    }
    setErrors({})
  }, [createModalOpen, editModalOpen, editingShop])

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
    if (error) {
      if (createError) dispatch(clearCreateError())
      if (updateError) dispatch(clearUpdateError())
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Organization code is required'
    } else if (formData.code.trim().length < 2) {
      newErrors.code = 'Code must be at least 2 characters'
    } else if (formData.code.trim().length > 50) {
      newErrors.code = 'Code must be at most 50 characters'
    }

    if (!editModalOpen) {
      if (!formData.admin_login_id.trim()) {
        newErrors.admin_login_id = 'Admin login ID is required'
      }
      if (!formData.admin_password) {
        newErrors.admin_password = 'Admin password is required'
      } else if (formData.admin_password.length < 6) {
        newErrors.admin_password = 'Password must be at least 6 characters'
      }
      if (!formData.admin_name.trim()) {
        newErrors.admin_name = 'Admin name is required'
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

      if (editModalOpen && editingShop) {
        result = await dispatch(updateShop({
          shopId: editingShop.id,
          shopData: {
            name: formData.name.trim(),
            code: formData.code.trim(),
          },
        }))
      } else {
        result = await dispatch(createShop({
          name: formData.name.trim(),
          code: formData.code.trim(),
          admin_login_id: formData.admin_login_id.trim(),
          admin_password: formData.admin_password,
          admin_name: formData.admin_name.trim(),
        }))
      }

      if (result.type.endsWith('/fulfilled')) {
        const created = result.payload
        const adminLogin = created?.primary_admin?.login_id ?? created?.admin_login_id
        dashboardToast.success(
          isEdit
            ? 'Organization details were saved.'
            : adminLogin
              ? `Org admin user ID: ${adminLogin}`
              : 'The new organization is ready.',
          isEdit ? 'Organization updated' : 'Organization created'
        )
      } else {
        dashboardToast.error(
          result.payload || `Failed to ${isEdit ? 'update' : 'create'} organization`,
          'Request failed'
        )
      }
    } catch (err) {
      console.error('Organization form error:', err)
      dashboardToast.error('An unexpected error occurred', 'Request failed')
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
      title={isEdit ? 'Edit Organization' : 'Create Organization'}
      subtitle={isEdit ? 'Update tenant details' : 'Add a new tenant with an org admin'}
      icon={Building2}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <FormButton type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </FormButton>
          <FormButton type="submit" form="shop-modal-form" loading={isLoading} disabled={isLoading}>
            {isEdit ? 'Update Organization' : 'Create Organization'}
          </FormButton>
        </div>
      }
    >
      <div className="space-y-4">
        {error && (
          <ErrorAlert message={error} type="error" onDismiss={clearError} />
        )}

        <form id="shop-modal-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Organization</h4>
            <FormInput
              label="Name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="Organization name"
              error={errors.name}
              required
            />
            <FormInput
              label="Code"
              type="text"
              value={formData.code}
              onChange={handleInputChange('code')}
              placeholder="ORG01"
              error={errors.code}
              required
            />
          </div>

          {!editModalOpen && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Initial Org Admin</h4>
              <p className="text-xs text-gray-500">
                This admin can log in to the org-admin portal for this tenant.
              </p>
              <FormInput
                label="Admin Name"
                type="text"
                value={formData.admin_name}
                onChange={handleInputChange('admin_name')}
                placeholder="Admin full name"
                error={errors.admin_name}
                required
              />
              <FormInput
                label="Admin Login ID"
                type="text"
                value={formData.admin_login_id}
                onChange={handleInputChange('admin_login_id')}
                placeholder="admin.user"
                error={errors.admin_login_id}
                required
              />
              <FormInput
                label="Admin Password"
                type="password"
                value={formData.admin_password}
                onChange={handleInputChange('admin_password')}
                placeholder="Minimum 6 characters"
                error={errors.admin_password}
                required
              />
            </div>
          )}

        </form>
      </div>
    </MinimalModal>
  )
}
