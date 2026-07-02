import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setSearchQuery,
  setFilterStatus,
  selectFilteredCompanies,
  fetchOrganizations,
  openEditModal,
  openDeleteModal,
  openCreateModal,
} from '../store/slices/companiesSlice';
import CompanyCard from '../components/CompanyCard';
import ShopModal from '../components/common/ShopModal';
import DeleteShopModal from '../components/shop/DeleteShopModal';
import SearchAndFilter from '../components/common/SearchAndFilter';
import PageShell from '../components/common/PageShell';
import { LottieLoader } from '../components/common/Lottie';
import { DASHBOARD_BTN_PRIMARY, DASHBOARD_BTN_SECONDARY, DASHBOARD_PANEL } from '../theme/dashboardTheme';

// function to manage the organizations in the system.
export default function Companies() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { searchQuery, filterStatus, isLoading, error, total } = useAppSelector(
    (state) => state.companies
  );
  const filteredCompanies = useAppSelector(selectFilteredCompanies);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  const handleViewCompany = (company) => {
    navigate(`/organizations/${company.id}`);
  };

  const handleEditCompany = (company) => {
    dispatch(openEditModal(company));
  };

  const handleDeleteCompany = (company) => {
    dispatch(openDeleteModal(company));
  };

  const handleRefresh = () => {
    dispatch(fetchOrganizations());
  };

  const handleAddOrganization = () => {
    dispatch(openCreateModal());
  };

  if (isLoading && filteredCompanies.length === 0) {
    return (
      <PageShell>
        <div className="flex min-h-96 items-center justify-center">
          <LottieLoader size="lg" label="Loading organizations..." centered />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage tenant organizations and their org admins
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className={DASHBOARD_BTN_SECONDARY}
          >
            <Building2 className="h-4 w-4" />
            {isLoading ? 'Refreshing…' : 'Refresh'}
          </button>
          <button type="button" onClick={handleAddOrganization} className={DASHBOARD_BTN_PRIMARY}>
            <Plus className="h-4 w-4" />
            Add organization
          </button>
        </div>
      </div>

      <div className={`${DASHBOARD_PANEL} p-4 sm:p-5`}>
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={(e) => dispatch(setSearchQuery(e.target.value))}
          searchPlaceholder="Search organizations..."
          filterValue={filterStatus}
          onFilterChange={(e) => dispatch(setFilterStatus(e.target.value))}
          filterOptions={[
            { value: 'all', label: 'All status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredCompanies.length} of {total} organizations
        </p>
        {error && (
          <div className="flex items-center gap-2 text-[#FF3B30]">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onView={handleViewCompany}
            onEdit={handleEditCompany}
            onDelete={handleDeleteCompany}
          />
        ))}
      </div>

      {filteredCompanies.length === 0 && !isLoading && (
        <div className={`${DASHBOARD_PANEL} py-12 text-center`}>
          <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-sm font-semibold text-gray-900">No organizations found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? 'Try adjusting your search criteria.'
              : 'Add your first organization to get started.'}
          </p>
        </div>
      )}

      <ShopModal />
      <DeleteShopModal />
    </PageShell>
  );
}
