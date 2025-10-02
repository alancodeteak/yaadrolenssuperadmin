import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { openCreateModal } from '../store/slices/companiesSlice'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function CreateShop() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Open the create modal and redirect to companies page
    dispatch(openCreateModal())
    navigate('/companies')
  }, [dispatch, navigate])

  return (
    <div className="flex items-center justify-center min-h-96">
      <LoadingSpinner 
        text="Redirecting to create shop..." 
        size="default"
      />
    </div>
  )
}