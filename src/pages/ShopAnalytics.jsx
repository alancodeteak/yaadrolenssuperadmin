import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchShopAnalytics, clearAnalyticsError } from '../store/slices/companiesSlice'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorAlert from '../components/common/ErrorAlert'
import PageHeader from '../components/common/PageHeader'
import ChartCard from '../components/charts/ChartCard'
import EmployeeStatusPieChart from '../components/charts/EmployeeStatusPieChart'
import AnalyticsOverviewChart from '../components/charts/AnalyticsOverviewChart'
import DemoAnalyticsBarChart from '../components/charts/DemoAnalyticsBarChart'
import InfoCard from '../components/common/InfoCard'
import { 
  RefreshCw, 
  Users, 
  UserCheck, 
  TrendingUp, 
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'

export default function ShopAnalytics() {
  const { shopId } = useParams()
  const dispatch = useAppDispatch()
  const { 
    shopAnalytics, 
    isLoadingAnalytics, 
    analyticsError 
  } = useAppSelector(state => state.companies)

  useEffect(() => {
    if (shopId) {
      dispatch(fetchShopAnalytics(shopId))
    }
  }, [dispatch, shopId])

  const handleRefresh = () => {
    if (shopId) {
      dispatch(fetchShopAnalytics(shopId))
      toast.success('Analytics data refreshed')
    }
  }

  if (isLoadingAnalytics && !shopAnalytics) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Loading Analytics..."
          showBackButton={true}
          backButtonText="Back to Shop"
          backButtonPath={`/shops/${shopId}`}
        />
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="large" text="Loading analytics data..." />
        </div>
      </div>
    )
  }

  if (analyticsError && !shopAnalytics) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Analytics Error"
          subtitle="Failed to load analytics data"
          showBackButton={true}
          backButtonText="Back to Shop"
          backButtonPath={`/shops/${shopId}`}
        />
        <ErrorAlert 
          message={analyticsError}
          type="error"
        />
      </div>
    )
  }

  if (!shopAnalytics) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Analytics Not Found"
          subtitle="No analytics data available for this shop"
          showBackButton={true}
          backButtonText="Back to Shop"
          backButtonPath={`/shops/${shopId}`}
        />
        <ErrorAlert 
          message="No analytics data found for this shop. Please check the shop ID and try again."
          type="error"
        />
      </div>
    )
  }

  const { shop, total_employees, active_employees, analytics, period_days } = shopAnalytics
  const inactiveEmployees = total_employees - active_employees
  const attendanceRate = total_employees > 0 ? ((active_employees / total_employees) * 100).toFixed(1) : 0

  const actions = (
    <button
      onClick={handleRefresh}
      disabled={isLoadingAnalytics}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
    >
      <RefreshCw className={`w-4 h-4 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
      <span>Refresh</span>
    </button>
  )

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`${shop.name} Analytics`}
        subtitle={`Shop Code: ${shop.shop_code} • Last ${period_days} days`}
        showBackButton={true}
        backButtonText="Back to Shop"
        backButtonPath={`/shops/${shopId}`}
        actions={actions}
      />
      
      {analyticsError && (
        <ErrorAlert 
          message={`Warning: ${analyticsError}. Showing cached data.`}
          type="warning"
          onDismiss={() => dispatch(clearAnalyticsError())}
        />
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoCard
          title="Total Employees"
          value={total_employees}
          icon={Users}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
        />
        <InfoCard
          title="Active Employees"
          value={active_employees}
          icon={UserCheck}
          iconColor="text-green-600"
          bgColor="bg-green-100"
        />
        <InfoCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={TrendingUp}
          iconColor="text-purple-600"
          bgColor="bg-purple-100"
        />
        <InfoCard
          title="Period Days"
          value={period_days}
          icon={Calendar}
          iconColor="text-orange-600"
          bgColor="bg-orange-100"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Status Pie Chart */}
        <ChartCard
          title="Employee Status Distribution"
          subtitle="Active vs Inactive employees"
        >
          <EmployeeStatusPieChart
            totalEmployees={total_employees}
            activeEmployees={active_employees}
            loading={isLoadingAnalytics}
            error={analyticsError}
          />
        </ChartCard>

        {/* Analytics Overview Chart */}
        <ChartCard
          title="Analytics Overview"
          subtitle="Performance trends over time"
        >
          <AnalyticsOverviewChart
            analytics={analytics}
            loading={isLoadingAnalytics}
            error={analyticsError}
          />
        </ChartCard>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo Performance Chart */}
        <ChartCard
          title="Performance Metrics"
          subtitle="Key performance indicators"
        >
          <DemoAnalyticsBarChart
            loading={isLoadingAnalytics}
            error={analyticsError}
          />
        </ChartCard>

        {/* Analytics Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Analytics Summary</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Data Points</span>
              <span className="text-sm font-semibold text-gray-900">{analytics.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Inactive Employees</span>
              <span className="text-sm font-semibold text-gray-900">{inactiveEmployees}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Activity Rate</span>
              <span className="text-sm font-semibold text-gray-900">{attendanceRate}%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Reporting Period</span>
              <span className="text-sm font-semibold text-gray-900">{period_days} days</span>
            </div>
          </div>

          {analytics.length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                No analytics data available for the selected period. 
                Data will appear as activities are recorded.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
