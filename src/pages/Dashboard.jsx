import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, RefreshCw, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPlatformStats } from '../store/slices/dashboardSlice';
import { openCreateModal } from '../store/slices/companiesSlice';
import { DashboardWidgetCard } from '../components/pages/dashboard';
import PageShell from '../components/common/PageShell';
import { LottieLoader } from '../components/common/Lottie';
import { dashboardToast } from '../utils/dashboardToast';
import { DASHBOARD_ACCENTS, DASHBOARD_BTN_SECONDARY, DASHBOARD_PANEL } from '../theme/dashboardTheme';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { stats, isLoading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchPlatformStats());
  }, [dispatch]);

  const handleRefresh = async () => {
    const result = await dispatch(fetchPlatformStats());
    if (fetchPlatformStats.fulfilled.match(result)) {
      dashboardToast.success('Dashboard data is up to date.', 'Refreshed');
    }
  };

  if (isLoading && stats.totalCompanies === 0 && !error) {
    return (
      <PageShell>
        <div className="flex min-h-96 items-center justify-center">
          <LottieLoader size="lg" label="Loading dashboard..." centered />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Platform overview across all organizations</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          className={DASHBOARD_BTN_SECONDARY}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200/60 bg-red-50 px-4 py-3 text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardWidgetCard
          title="Organizations"
          href="/companies"
          loading={isLoading}
          stats={[
            { label: 'Total', value: String(stats.totalCompanies), accent: DASHBOARD_ACCENTS.blue },
            {
              label: 'Active',
              value: String(stats.activeOrganizations),
              accent: DASHBOARD_ACCENTS.green,
            },
          ]}
        />
        <DashboardWidgetCard
          title="Workforce"
          loading={isLoading}
          stats={[
            {
              label: 'Total employees',
              value: stats.totalEmployees.toLocaleString(),
              accent: DASHBOARD_ACCENTS.purple,
            },
            {
              label: 'Attendance today',
              value: String(stats.totalAttendance),
              accent: DASHBOARD_ACCENTS.orange,
            },
          ]}
        />
        <DashboardWidgetCard
          title="Attendance"
          loading={isLoading}
          stats={[
            {
              label: 'Rate today',
              value: `${stats.attendanceRate}%`,
              accent: DASHBOARD_ACCENTS.green,
            },
            {
              label: 'Check-ins',
              value: String(stats.totalAttendance),
              accent: DASHBOARD_ACCENTS.gray,
            },
          ]}
        />
      </div>

      <div className={`${DASHBOARD_PANEL} p-4 sm:p-5`}>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Quick actions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              dispatch(openCreateModal());
              navigate('/companies');
            }}
            className="flex items-center gap-3 rounded-xl border border-gray-200/60 p-4 text-left transition-colors hover:bg-gray-50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#007AFF]/10 text-[#007AFF]">
              <Building2 className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <span className="block text-sm font-medium text-gray-900">Add organization</span>
              <span className="text-xs text-gray-500">Create a new tenant with an org admin</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => navigate('/companies')}
            className="flex items-center gap-3 rounded-xl border border-gray-200/60 p-4 text-left transition-colors hover:bg-gray-50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#34C759]/10 text-[#34C759]">
              <Users className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <span className="block text-sm font-medium text-gray-900">Manage organizations</span>
              <span className="text-xs text-gray-500">View, edit, or disable tenants</span>
            </div>
          </button>
        </div>
      </div>
    </PageShell>
  );
}
