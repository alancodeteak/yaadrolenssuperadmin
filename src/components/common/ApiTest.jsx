import { useState } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { fetchShopDetails } from '../../store/slices/companiesSlice'

export default function ApiTest() {
  const [testShopId, setTestShopId] = useState('')
  const [testResult, setTestResult] = useState('')
  const dispatch = useAppDispatch()

  const testApiCall = async () => {
    if (!testShopId) {
      setTestResult('Please enter a shop ID')
      return
    }

    setTestResult('Testing API call...')
    
    try {
      const result = await dispatch(fetchShopDetails(testShopId))
      
      if (result.type.endsWith('/fulfilled')) {
        setTestResult(`✅ Success! Shop data: ${JSON.stringify(result.payload, null, 2)}`)
      } else {
        setTestResult(`❌ Error: ${result.payload}`)
      }
    } catch (error) {
      setTestResult(`❌ Exception: ${error.message}`)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">API Test Tool</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Base URL: {import.meta.env.VITE_API_BASE_URL || 'NOT SET'}
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Auth Token: {localStorage.getItem('auth_token') ? 'Present' : 'Missing'}
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Shop ID:
          </label>
          <input
            type="text"
            value={testShopId}
            onChange={(e) => setTestShopId(e.target.value)}
            placeholder="Enter shop ID to test"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={testApiCall}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Test API Call
        </button>
        
        {testResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
