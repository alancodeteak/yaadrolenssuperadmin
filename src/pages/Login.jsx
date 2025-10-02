import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loginUser, clearError } from '../store/slices/authSlice'

export default function Login() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector(state => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})
    dispatch(clearError()) // Clear any previous errors
    
    try {
      const result = await dispatch(loginUser({ 
        email: email.trim(), 
        password 
      }))
      
      if (loginUser.fulfilled.match(result)) {
        toast.success('Login successful! Welcome back.')
      } else {
        toast.error(result.payload || 'Login failed. Please try again.')
        setErrors({ general: result.payload || 'Login failed. Please try again.' })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
      setErrors({ general: 'Login failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-blue-500">
      {/* Top Section: Logo */}
      <div className="flex flex-col items-center pt-12 pb-4">
        <img 
          src="/assets/Yadro-logo.png" 
          alt="Yaadro Logo" 
          className="w-32 h-32 object-contain mb-2" 
          style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))' }}
        />
        <h1 className="text-2xl font-bold text-white mb-2">yaadrolens</h1>
        <p className="text-sm text-blue-100 text-center px-6">
          Advanced lens analytics powered by intelligent insights
        </p>
      </div>
      
      {/* Login Card */}
      <div className="w-full flex-1 flex flex-col justify-end">
        <form onSubmit={handleSubmit} className="bg-white rounded-t-3xl shadow-lg px-6 pt-6 pb-6 w-full max-w-md mx-auto flex flex-col gap-3">
          {/* Form Heading */}
          <h2 className="text-xl font-bold text-center mb-1 text-black">Log in</h2>
          
          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {errors.general}
            </div>
          )}
          
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-500">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: '' }))
                }
              }}
              className={`w-full rounded-lg px-3 py-2 shadow-sm text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.email ? 'border border-red-300 bg-red-50' : ''
              }`}
              disabled={isSubmitting || isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-500">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="**********"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: '' }))
                  }
                }}
                className={`w-full rounded-lg px-3 py-2 shadow-sm text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 pr-10 ${
                  errors.password ? 'border border-red-300 bg-red-50' : ''
                }`}
                disabled={isSubmitting || isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isSubmitting || isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            <div className="flex justify-end mt-1">
              <button
                type="button"
                className="text-xs text-blue-500 hover:underline focus:outline-none"
                disabled={isSubmitting || isLoading}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg mt-2 hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {isSubmitting ? 'Logging in...' : 'Loading...'}
              </>
            ) : (
              'Log in'
            )}
          </button>

          {/* Powered by Section */}
          <div className="flex flex-col items-center mt-4 mb-1">
            <span className="text-xs text-blue-500 mb-1">Powered by</span>
            <img 
              src="/assets/codeteak-logo.png" 
              alt="CodeTeak Logo" 
              className="h-4 object-contain"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
