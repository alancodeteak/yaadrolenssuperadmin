import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, RefreshCw, AlertCircle, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchDepartments,
  fetchShopDetails,
  clearDepartmentsError,
  openCreateDepartmentModal,
  openEditDepartmentModal,
  openDeleteDepartmentModal,
} from '../store/slices/companiesSlice';
import DepartmentCard from '../components/DepartmentCard';
import DepartmentModal from '../components/common/DepartmentModal';
import DeleteDepartmentModal from '../components/department/DeleteDepartmentModal';
import { LottieLoader } from '../components/common/Lottie';
import ErrorAlert from '../components/common/ErrorAlert';
import SearchAndFilter from '../components/common/SearchAndFilter';
import PageHeader from '../components/common/PageHeader';
import PageShell from '../components/common/PageShell';
import { dashboardToast } from '../utils/dashboardToast';
import { DASHBOARD_BTN_PRIMARY, DASHBOARD_BTN_SECONDARY, DASHBOARD_PANEL } from '../theme/dashboardTheme';

export default function Departments() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    departments,
    isLoadingDepartments,
    departmentsError,
    shopDetails,
  } = useAppSelector((state) => state.companies);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  useEffect(() => {
    if (orgId) {
      dispatch(fetchShopDetails(orgId));
      dispatch(fetchDepartments({ orgId, activeOnly: filterActive === 'active' }));
    }
  }, [dispatch, orgId, filterActive]);

  const handleViewDepartment = (department) => {
    navigate(`/organizations/${orgId}/departments/${department.id}`);
  };

  const handleRefresh = () => {
    if (orgId) {
      dispatch(fetchDepartments({ orgId, activeOnly: filterActive === 'active' }));
      dashboardToast.success('Departments refreshed.', 'Refreshed');
    }
  };

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterActive === 'all' ||
      (filterActive === 'active' ? dept.is_active : !dept.is_active);
    return matchesSearch && matchesFilter;
  });

  const backPath = `/organizations/${orgId}`;
  const orgName = shopDetails?.name || 'Organization';

  if (isLoadingDepartments && departments.length === 0) {
    return (
      <PageShell className="space-y-6">
        <PageHeader title="Departments" showBackButton backButtonPath={backPath} />
        <div className="flex min-h-96 items-center justify-center">
          <LottieLoader size="lg" label="Loading departments..." centered />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-6">
      <PageHeader
        title="Departments"
        subtitle={`${orgName} — manage departments for this organization`}
        showBackButton
        backButtonPath={backPath}
        actions={
          <>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoadingDepartments}
              className={DASHBOARD_BTN_SECONDARY}
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingDepartments ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => dispatch(openCreateDepartmentModal())}
              className={DASHBOARD_BTN_PRIMARY}
            >
              <Plus className="h-4 w-4" />
              Add department
            </button>
          </>
        }
      />

      <div className={`${DASHBOARD_PANEL} p-4 sm:p-5`}>
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          searchPlaceholder="Search departments..."
          filterValue={filterActive}
          onFilterChange={(e) => setFilterActive(e.target.value)}
          filterOptions={[
            { value: 'all', label: 'All departments' },
            { value: 'active', label: 'Active only' },
            { value: 'inactive', label: 'Inactive only' },
          ]}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredDepartments.length} of {departments.length} departments
        </p>
        {departmentsError && (
          <div className="flex items-center gap-2 text-[#FF9500]">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Could not load departments</span>
          </div>
        )}
      </div>

      {departmentsError && (
        <ErrorAlert message={departmentsError} onDismiss={() => dispatch(clearDepartmentsError())} />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDepartments.map((department) => (
          <DepartmentCard
            key={department.id}
            department={{
              ...department,
              employees_count: department.employee_count,
            }}
            onView={handleViewDepartment}
            onEdit={(dept) => dispatch(openEditDepartmentModal(dept))}
            onDelete={(dept) => dispatch(openDeleteDepartmentModal(dept))}
          />
        ))}
      </div>

      {filteredDepartments.length === 0 && !isLoadingDepartments && (
        <div className={`${DASHBOARD_PANEL} py-12 text-center`}>
          <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-sm font-semibold text-gray-900">No departments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? 'Try adjusting your search.'
              : 'Add departments so org admins can assign employees.'}
          </p>
        </div>
      )}

      <DepartmentModal orgId={orgId} />
      <DeleteDepartmentModal orgId={orgId} />
    </PageShell>
  );
}
