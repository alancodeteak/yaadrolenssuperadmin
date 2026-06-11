import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteShop, closeDeleteModal } from '../../store/slices/companiesSlice';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { dashboardToast } from '../../utils/dashboardToast';
import { inputClass } from '../../theme/dashboardTheme';

export default function DeleteShopModal() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    deleteModalOpen,
    deletingShop,
    isDeleting,
    deleteError,
  } = useAppSelector((state) => state.companies);

  const [confirmationText, setConfirmationText] = useState('');

  const handleConfirm = async () => {
    if (!deletingShop) return;

    try {
      const result = await dispatch(deleteShop(deletingShop.id));

      if (deleteShop.fulfilled.match(result)) {
        dashboardToast.success(
          `"${deletingShop.name}" has been disabled.`,
          'Organization disabled'
        );
        if (window.location.pathname.includes('/organizations/')) {
          navigate('/companies');
        }
      } else {
        dashboardToast.error(result.payload || 'Failed to disable organization', 'Request failed');
      }
    } catch (error) {
      console.error('Disable organization error:', error);
      dashboardToast.error('An unexpected error occurred', 'Request failed');
    }
  };

  const handleClose = () => {
    setConfirmationText('');
    dispatch(closeDeleteModal());
  };

  if (!deletingShop) return null;

  const isConfirmDisabled = confirmationText !== deletingShop.name || isDeleting;

  return (
    <ConfirmationDialog
      isOpen={deleteModalOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      confirmDisabled={isConfirmDisabled}
      title="Disable Organization"
      variant="destructive"
      confirmText="Disable Organization"
      cancelText="Cancel"
      isLoading={isDeleting}
    >
      <div className="space-y-3">
        <p>
          Are you sure you want to disable <strong>&quot;{deletingShop.name}&quot;</strong>?
          Org admins and kiosks for this tenant will no longer be able to operate until re-enabled.
        </p>

        <div className="rounded-xl border border-amber-200/60 bg-amber-50 p-3">
          <p className="mb-2 text-sm font-medium text-amber-800">Disabling will:</p>
          <ul className="space-y-1 text-sm text-amber-700">
            <li>• Mark the organization as inactive</li>
            <li>• Block org admin and kiosk access</li>
            <li>• Preserve all existing data</li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            To confirm, type the organization name below:
          </p>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={`Type "${deletingShop.name}" to confirm`}
            className={clsx(
              inputClass,
              confirmationText && confirmationText !== deletingShop.name
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : ''
            )}
            disabled={isDeleting}
          />
          {confirmationText && confirmationText !== deletingShop.name && (
            <p className="text-sm text-red-600">Organization name doesn&apos;t match</p>
          )}
        </div>

        {deleteError && (
          <div className="rounded-xl border border-red-200/60 bg-red-50 p-3">
            <p className="text-sm text-red-800">{deleteError}</p>
          </div>
        )}
      </div>
    </ConfirmationDialog>
  );
}
