import { useState, useEffect } from 'react'
import { Building2, Search, Filter, Plus } from 'lucide-react'
import CompanyCard from '../components/CompanyCard'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    // Simulate API call to fetch companies
    const fetchCompanies = async () => {
      setIsLoading(true)
      // Simulate loading delay
      setTimeout(() => {
        const mockCompanies = [
          {
            id: 1,
            name: "TechCorp Solutions",
            industry: "Technology",
            location: "New York, NY",
            status: "active",
            employeeCount: 156,
            attendanceToday: 142,
            attendanceRate: 91.0,
            lastActivity: "2 hours ago"
          },
          {
            id: 2,
            name: "GreenEdge Manufacturing",
            industry: "Manufacturing",
            location: "Chicago, IL",
            status: "active",
            employeeCount: 89,
            attendanceToday: 82,
            attendanceRate: 92.1,
            lastActivity: "1 hour ago"
          },
          {
            id: 3,
            name: "Creative Agency Ltd",
            industry: "Marketing",
            location: "Los Angeles, CA",
            status: "active",
            employeeCount: 34,
            attendanceToday: 31,
            attendanceRate: 91.2,
            lastActivity: "3 hours ago"
          },
          {
            id: 4,
            name: "Global Services Inc",
            industry: "Consulting",
            location: "Boston, MA",
            status: "inactive",
            employeeCount: 67,
            attendanceToday: 0,
            attendanceRate: 85.5,
            lastActivity: "1 day ago"
          },
          {
            id: 5,
            name: "HealthFirst Medical",
            industry: "Healthcare",
            location: "Miami, FL",
            status: "active",
            employeeCount: 234,
            attendanceToday: 218,
            attendanceRate: 93.2,
            lastActivity: "30 minutes ago"
          }
        ]
        setCompanies(mockCompanies)
        setIsLoading(false)
      }, 1000)
    }

    fetchCompanies()
  }, [])

  const handleViewCompany = (company) => {
    console.log('View company:', company.name)
    // Navigate to company details or open modal
  }

  const handleEditCompany = (company) => {
    console.log('Edit company:', company.name)
    // Open edit modal
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || company.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2 text-gray-500">
          <Building2 className="w-5 h-5 animate-pulse" />
          <span>Loading companies...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600">Manage company information and attendance</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by Status */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredCompanies.length} of {companies.length} companies
        </p>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map(company => (
          <CompanyCard
            key={company.id}
            company={company}
            onView={handleViewCompany}
            onEdit={handleEditCompany}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCompanies.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Add your first company to get started.'}
          </p>
        </div>
      )}
    </div>
  )
}

