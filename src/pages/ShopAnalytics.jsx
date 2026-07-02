import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchShopAnalytics, clearAnalyticsError } from '../store/slices/companiesSlice';
import { LottieLoader } from '../components/common/Lottie';
import ErrorAlert from '../components/common/ErrorAlert';
import PageHeader from '../components/common/PageHeader';
import PageShell from '../components/common/PageShell';
import ChartCard from '../components/charts/ChartCard';
import EmployeeStatusPieChart from '../components/charts/EmployeeStatusPieChart';
import AnalyticsOverviewChart from '../components/charts/AnalyticsOverviewChart';
import DemoAnalyticsBarChart from '../components/charts/DemoAnalyticsBarChart';
import InfoCard from '../components/common/InfoCard';
import { dashboardToast } from '../utils/dashboardToast';
import { DASHBOARD_ACCENTS, DASHBOARD_BTN_SECONDARY, DASHBOARD_PANEL } from '../theme/dashboardTheme';
import { RefreshCw, Users, UserCheck, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

export default function ShopAnalytics() {
  const { orgId } = useParams();
  const dispatch = useAppDispatch();
  const { shopAnalytics, isLoadingAnalytics, analyticsError } = useAppSelector(
    (state) => state.companies
  );

  useEffect(() => {
    if (orgId) {
      dispatch(fetchShopAnalytics(orgId));
    }
  }, [dispatch, orgId]);

  const handleRefresh = () => {
    if (orgId) {
      dispatch(fetchShopAnalytics(orgId));
      dashboardToast.success('Analytics data refreshed.', 'Refreshed');
    }
  };

  const backPath = `/organizations/${orgId}`;

  if (isLoadingAnalytics && !shopAnalytics) {
    return (
      <PageShell className="space-y-6">
        <PageHeader
          title="Loading analytics…"
          showBackButton
          backButtonText="Back to organization"
          backButtonPath={backPath}
        />
        <div className="flex min-h-96 items-center justify-center">
          <LottieLoader size="lg" label="Loading analytics data..." centered />
        </div>
      </PageShell>
    );
  }

  if (analyticsError && !shopAnalytics) {
    return (
      <PageShell className="space-y-6">
        <PageHeader
          title="Analytics error"
          subtitle="Failed to load analytics data"
          showBackButton
          backButtonText="Back to organization"
          backButtonPath={backPath}
        />
        <ErrorAlert message={analyticsError} type="error" />
      </PageShell>
    );
  }

  if (!shopAnalytics) {
    return (
      <PageShell className="space-y-6">
        <PageHeader
          title="Analytics not found"
          subtitle="No analytics data available"
          showBackButton
          backButtonText="Back to organization"
          backButtonPath={backPath}
        />
        <ErrorAlert
          message="No analytics data found for this organization."
          type="error"
        />
      </PageShell>
    );
  }

  const { shop, total_employees, active_employees, analytics, period_days } = shopAnalytics;
  const inactiveEmployees = total_employees - active_employees;
  const attendanceRate =
    total_employees > 0 ? ((active_employees / total_employees) * 100).toFixed(1) : 0;

  return (
    <PageShell className="space-y-6">
      <PageHeader
        title={`${shop.name} stats`}
        subtitle={`Code: ${shop.shop_code || shop.code} · Employee overview`}
        showBackButton
        backButtonText="Back to organization"
        backButtonPath={backPath}
        actions={
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoadingAnalytics}
            className={DASHBOARD_BTN_SECONDARY}
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        }
      />

      {analyticsError && (
        <ErrorAlert
          message={`Warning: ${analyticsError}. Showing cached data.`}
          type="warning"
          onDismiss={() => dispatch(clearAnalyticsError())}
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total employees" value={total_employees} icon={Users} accent={DASHBOARD_ACCENTS.blue} />
        <InfoCard title="Active employees" value={active_employees} icon={UserCheck} accent={DASHBOARD_ACCENTS.green} />
        <InfoCard title="Attendance rate" value={`${attendanceRate}%`} icon={TrendingUp} accent={DASHBOARD_ACCENTS.purple} />
        <InfoCard title="Period days" value={period_days} icon={Calendar} accent={DASHBOARD_ACCENTS.orange} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Employee status" subtitle="Active vs inactive employees">
          <EmployeeStatusPieChart
            totalEmployees={total_employees}
            activeEmployees={active_employees}
            loading={isLoadingAnalytics}
            error={analyticsError}
          />
        </ChartCard>
        <ChartCard title="Analytics overview" subtitle="Performance trends over time">
          <AnalyticsOverviewChart
            analytics={analytics}
            loading={isLoadingAnalytics}
            error={analyticsError}
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Employee breakdown" subtitle="Active vs inactive employees">
          <DemoAnalyticsBarChart
            loading={isLoadingAnalytics}
            error={analyticsError}
            totalEmployees={total_employees}
            activeEmployees={active_employees}
          />
        </ChartCard>

        <div className={`${DASHBOARD_PANEL} p-4 sm:p-5`}>
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#007AFF]" />
            <h3 className="text-sm font-semibold text-gray-900">Analytics summary</h3>
          </div>
          <div className="space-y-2">
            {[
              ['Data points', analytics.length],
              ['Inactive employees', inactiveEmployees],
              ['Activity rate', `${attendanceRate}%`],
              ['Reporting period', `${period_days} days`],
            ].map(([label, val]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5"
              >
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm font-semibold text-gray-900">{val}</span>
              </div>
            ))}
          </div>
          {analytics.length === 0 && (
            <div className="mt-4 rounded-xl border border-amber-200/60 bg-amber-50 p-3">
              <p className="text-sm text-amber-800">
                No analytics data for the selected period. Data will appear as activities are recorded.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
