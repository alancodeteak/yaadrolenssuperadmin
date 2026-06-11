import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  Edit,
  Trash2,
  Calendar,
  Users,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchDepartmentDetails,
  clearDepartmentDetails,
  clearDepartmentDetailsError,
  openEditDepartmentModal,
  openDeleteDepartmentModal,
} from '../store/slices/companiesSlice';
import PageHeader from '../components/common/PageHeader';
import PageShell from '../components/common/PageShell';
import { LottieLoader } from '../components/common/Lottie';
import ErrorAlert from '../components/common/ErrorAlert';
import Card from '../components/common/Card/Card';
import DepartmentModal from '../components/common/DepartmentModal';
import DeleteDepartmentModal from '../components/department/DeleteDepartmentModal';
import {
  DASHBOARD_BTN_DESTRUCTIVE,
  DASHBOARD_BTN_PRIMARY,
  DASHBOARD_BTN_SECONDARY,
  DASHBOARD_PANEL,
} from '../theme/dashboardTheme';
import clsx from 'clsx';

export default function DepartmentDetails() {
  const { orgId, departmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { departmentDetails, isLoadingDepartmentDetails, departmentDetailsError } =
    useAppSelector((state) => state.companies);

  useEffect(() => {
    if (orgId && departmentId) {
      dispatch(fetchDepartmentDetails({ orgId, departmentId }));
    }
    return () => {
      dispatch(clearDepartmentDetails());
    };
  }, [dispatch, orgId, departmentId]);

  const handleBack = () => {
    navigate(`/organizations/${orgId}/departments`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoadingDepartmentDetails && !departmentDetails) {
    return (
      <PageShell>
        <div className="flex min-h-96 items-center justify-center">
          <LottieLoader size="lg" label="Loading department details..." centered />
        </div>
      </PageShell>
    );
  }

  if ((departmentDetailsError && !departmentDetails) || !departmentDetails) {
    return (
      <PageShell className="space-y-6">
        <PageHeader
          title="Department details"
          subtitle={departmentDetailsError ? 'Error loading department' : 'Department not found'}
          showBackButton
          onBack={handleBack}
        />
        {departmentDetailsError ? (
          <>
            <ErrorAlert
              message={departmentDetailsError}
              type="error"
              onDismiss={() => dispatch(clearDepartmentDetailsError())}
            />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => dispatch(fetchDepartmentDetails({ orgId, departmentId }))}
                className={DASHBOARD_BTN_PRIMARY}
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </>
        ) : (
          <div className={`${DASHBOARD_PANEL} py-12 text-center`}>
            <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-sm text-gray-500">The requested department could not be found.</p>
          </div>
        )}
      </PageShell>
    );
  }

  const actions = (
    <>
      <button
        type="button"
        onClick={() => dispatch(fetchDepartmentDetails({ orgId, departmentId }))}
        disabled={isLoadingDepartmentDetails}
        className={DASHBOARD_BTN_SECONDARY}
      >
        <RefreshCw className={`h-4 w-4 ${isLoadingDepartmentDetails ? 'animate-spin' : ''}`} />
        Refresh
      </button>
      <button
        type="button"
        onClick={() => dispatch(openEditDepartmentModal(departmentDetails))}
        className={DASHBOARD_BTN_PRIMARY}
      >
        <Edit className="h-4 w-4" />
        Edit
      </button>
      <button
        type="button"
        onClick={() => dispatch(openDeleteDepartmentModal(departmentDetails))}
        className={DASHBOARD_BTN_DESTRUCTIVE}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </>
  );

  return (
    <PageShell className="space-y-6">
      <PageHeader
        title={departmentDetails.name}
        subtitle={`Department ID: ${departmentDetails.id}`}
        showBackButton
        onBack={handleBack}
        actions={actions}
      />

      {departmentDetailsError && (
        <ErrorAlert
          message={departmentDetailsError}
          type="error"
          onDismiss={() => dispatch(clearDepartmentDetailsError())}
        />
      )}

      <Card variant="panel" bodyClassName="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5856D6]/10 text-[#5856D6]">
            <Building2 className="h-7 w-7" strokeWidth={2} />
          </span>
          <div>
            <span
              className={clsx(
                'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                departmentDetails.is_active
                  ? 'bg-[#34C759]/10 text-[#34C759]'
                  : 'bg-gray-100 text-gray-500'
              )}
            >
              {departmentDetails.is_active ? 'Active' : 'Inactive'}
            </span>
            {departmentDetails.description && (
              <p className="mt-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                {departmentDetails.description}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card variant="panel" title="Basic information" bodyClassName="p-4 sm:p-5">
          <dl className="space-y-3">
            {[
              ['Department name', departmentDetails.name],
              ['Department ID', departmentDetails.id],
              ['Status', departmentDetails.is_active ? 'Active' : 'Inactive'],
              departmentDetails.location && ['Location', departmentDetails.location],
              departmentDetails.manager_name && ['Manager', departmentDetails.manager_name],
            ]
              .filter(Boolean)
              .map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0"
                >
                  <dt className="text-sm text-gray-500">{label}</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {label === 'Location' && (
                      <MapPin className="mr-1 inline h-3.5 w-3.5 text-gray-400" />
                    )}
                    {label === 'Manager' && (
                      <Users className="mr-1 inline h-3.5 w-3.5 text-gray-400" />
                    )}
                    {value}
                  </dd>
                </div>
              ))}
          </dl>
        </Card>

        <Card variant="panel" title="Timeline" bodyClassName="p-4 sm:p-5">
          <dl className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 py-2">
              <dt className="text-sm text-gray-500">Created</dt>
              <dd className="flex items-center text-sm font-medium text-gray-900">
                <Calendar className="mr-1 h-3.5 w-3.5 text-gray-400" />
                {formatDate(departmentDetails.created_at)}
              </dd>
            </div>
            {departmentDetails.updated_at &&
              departmentDetails.updated_at !== departmentDetails.created_at && (
                <div className="flex items-center justify-between border-b border-gray-100 py-2">
                  <dt className="text-sm text-gray-500">Last updated</dt>
                  <dd className="flex items-center text-sm font-medium text-gray-900">
                    <Calendar className="mr-1 h-3.5 w-3.5 text-gray-400" />
                    {formatDate(departmentDetails.updated_at)}
                  </dd>
                </div>
              )}
          </dl>
        </Card>
      </div>

      <DepartmentModal orgId={orgId} />
      <DeleteDepartmentModal orgId={orgId} />
    </PageShell>
  );
}
