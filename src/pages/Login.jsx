import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [shopOwnerId, setShopOwnerId] = useState('')

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (shopOwnerId && password && onLogin) {
      onLogin({ shopOwnerId, password })
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
          
          {/* Shop Owner ID Field */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-500">
              Shop Owner ID
            </label>
            <input
              type="text"
              placeholder="Your Id"
              value={shopOwnerId}
              onChange={(e) => setShopOwnerId(e.target.value)}
              className="w-full rounded-lg px-3 py-2 shadow-sm text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
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
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-3 py-2 shadow-sm text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <button
                type="button"
                className="text-xs text-blue-500 hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg mt-2 hover:bg-blue-600 transition"
          >
            Log in
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
