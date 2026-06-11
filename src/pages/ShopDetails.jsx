import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchShopDetails,
  clearShopDetails,
  openEditModal,
  openDeleteModal,
} from '../store/slices/companiesSlice';
import { LottieLoader } from '../components/common/Lottie';
import ErrorAlert from '../components/common/ErrorAlert';
import PageHeader from '../components/common/PageHeader';
import PageShell from '../components/common/PageShell';
import ShopInfoDisplay from '../components/shop/ShopInfoDisplay';
import ShopModal from '../components/common/ShopModal';
import DeleteShopModal from '../components/shop/DeleteShopModal';
import { dashboardToast } from '../utils/dashboardToast';
import {
  DASHBOARD_BTN_DESTRUCTIVE,
  DASHBOARD_BTN_PRIMARY,
  DASHBOARD_BTN_SECONDARY,
} from '../theme/dashboardTheme';
import { Edit, RefreshCw, Trash2, BarChart3, Building2 } from 'lucide-react';

export default function ShopDetails() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { shopDetails, isLoadingDetails, detailsError } = useAppSelector(
    (state) => state.companies
  );

  useEffect(() => {
    if (orgId) {
      dispatch(fetchShopDetails(orgId));
    }
    return () => {
      dispatch(clearShopDetails());
    };
  }, [dispatch, orgId]);

  const handleRefresh = () => {
    if (orgId) {
      dispatch(fetchShopDetails(orgId));
      dashboardToast.success('Organization details refreshed.', 'Refreshed');
    }
  };

  const handleEdit = () => {
    if (shopDetails) dispatch(openEditModal(shopDetails));
  };

  const handleDisable = () => {
    if (shopDetails) dispatch(openDeleteModal(shopDetails));
  };

  const isActive = shopDetails?.status === 'active';

  const actions = shopDetails ? (
    <>
      <button
        type="button"
        onClick={handleRefresh}
        disabled={isLoadingDetails}
        className={DASHBOARD_BTN_SECONDARY}
      >
        <RefreshCw className={`h-4 w-4 ${isLoadingDetails ? 'animate-spin' : ''}`} />
        Refresh
      </button>
      <button type="button" onClick={handleEdit} className={DASHBOARD_BTN_PRIMARY}>
        <Edit className="h-4 w-4" />
        Edit
      </button>
      <button
        type="button"
        onClick={() => navigate(`/organizations/${orgId}/departments`)}
        className={DASHBOARD_BTN_SECONDARY}
      >
        <Building2 className="h-4 w-4" />
        Departments
      </button>
      <button
        type="button"
        onClick={() => navigate(`/organizations/${orgId}/analytics`)}
        className={DASHBOARD_BTN_SECONDARY}
      >
        <BarChart3 className="h-4 w-4" />
        Stats
      </button>
      {isActive && (
        <button type="button" onClick={handleDisable} className={DASHBOARD_BTN_DESTRUCTIVE}>
          <Trash2 className="h-4 w-4" />
          Disable
        </button>
      )}
    </>
  ) : null;

  if (isLoadingDetails && !shopDetails) {
    return (
      <PageShell className="space-y-6">
        <PageHeader title="Loading organization…" showBackButton />
        <div className="flex min-h-96 items-center justify-center">
          <LottieLoader size="lg" label="Loading organization details..." centered />
        </div>
      </PageShell>
    );
  }

  if (detailsError && !shopDetails) {
    return (
      <PageShell className="space-y-6">
        <PageHeader
          title="Organization details"
          subtitle="Error loading organization"
          showBackButton
        />
        <ErrorAlert message={detailsError} type="error" />
      </PageShell>
    );
  }

  if (!shopDetails) {
    return (
      <PageShell className="space-y-6">
        <PageHeader
          title="Organization not found"
          subtitle="The requested organization could not be found"
          showBackButton
        />
        <ErrorAlert
          message="Organization not found. Please check the ID and try again."
          type="error"
        />
      </PageShell>
    );
  }

  const code = shopDetails.code || shopDetails.shop_code;

  return (
    <PageShell className="space-y-6">
      <PageHeader
        title={shopDetails.name}
        subtitle={`Code: ${code}`}
        showBackButton
        actions={actions}
      />
      <ShopInfoDisplay shop={shopDetails} />
      <ShopModal />
      <DeleteShopModal />
    </PageShell>
  );
}
