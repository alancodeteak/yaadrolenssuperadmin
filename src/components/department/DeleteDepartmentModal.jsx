import { useState } from 'react';
import clsx from 'clsx';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  deleteDepartment,
  closeDeleteDepartmentModal,
  clearDeleteDepartmentError,
} from '../../store/slices/companiesSlice';
import MinimalModal from '../common/MinimalModal';
import FormButton from '../common/FormButton';
import ErrorAlert from '../common/ErrorAlert';
import { dashboardToast } from '../../utils/dashboardToast';
import { inputClass } from '../../theme/dashboardTheme';

export default function DeleteDepartmentModal({ orgId }) {
  const dispatch = useAppDispatch();
  const {
    deleteDepartmentModalOpen,
    deletingDepartment,
    isDeletingDepartment,
    deleteDepartmentError,
  } = useAppSelector((state) => state.companies);

  const [confirmationText, setConfirmationText] = useState('');
  const isConfirmed = deletingDepartment && confirmationText === deletingDepartment.name;

  const handleInputChange = (e) => {
    setConfirmationText(e.target.value);
    if (deleteDepartmentError) {
      dispatch(clearDeleteDepartmentError());
    }
  };

  const handleDelete = async () => {
    if (!isConfirmed || !deletingDepartment) return;

    try {
      const result = await dispatch(
        deleteDepartment({
          orgId,
          departmentId: deletingDepartment.id,
        })
      );

      if (deleteDepartment.fulfilled.match(result)) {
        dashboardToast.success(
          `"${deletingDepartment.name}" was deactivated.`,
          'Department deleted'
        );
        if (result.payload.employee_count > 0) {
          dashboardToast.info(
            `${result.payload.employee_count} employee(s) were unassigned.`,
            'Employees updated'
          );
        }
      } else {
        dashboardToast.error(result.payload || 'Failed to delete department', 'Request failed');
      }
    } catch (error) {
      console.error('Delete department error:', error);
      dashboardToast.error('An unexpected error occurred', 'Request failed');
    }
  };

  const handleClose = () => {
    setConfirmationText('');
    dispatch(closeDeleteDepartmentModal());
  };

  if (!deletingDepartment) return null;

  return (
    <MinimalModal
      isOpen={deleteDepartmentModalOpen}
      onClose={handleClose}
      title="Delete department"
      subtitle="This action cannot be undone"
      icon={Trash2}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-3">
          <FormButton
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeletingDepartment}
          >
            Cancel
          </FormButton>
          <FormButton
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={!isConfirmed || isDeletingDepartment}
            loading={isDeletingDepartment}
          >
            Delete department
          </FormButton>
        </div>
      }
    >
      <div className="space-y-4">
        {deleteDepartmentError && (
          <ErrorAlert
            message={deleteDepartmentError}
            type="error"
            onDismiss={() => dispatch(clearDeleteDepartmentError())}
          />
        )}

        <div className="rounded-xl border border-red-200/60 bg-red-50 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#FF3B30]" />
            <p className="text-sm text-red-700">
              You are about to delete <strong>&quot;{deletingDepartment.name}&quot;</strong>.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="confirmation" className="mb-2 block text-xs font-medium text-gray-500">
            Type the department name to confirm:
          </label>
          <div className="mb-2 rounded-xl border border-amber-200/60 bg-amber-50 p-2">
            <p className="text-sm text-amber-800">
              <strong>Name:</strong>{' '}
              <span className="font-mono">{deletingDepartment.name}</span>
            </p>
          </div>
          <input
            type="text"
            id="confirmation"
            value={confirmationText}
            onChange={handleInputChange}
            placeholder={`Type "${deletingDepartment.name}" to confirm`}
            className={clsx(
              inputClass,
              confirmationText && !isConfirmed && 'border-red-300 focus:border-red-400 focus:ring-red-200',
              confirmationText && isConfirmed && 'border-[#34C759]/40 focus:border-[#34C759] focus:ring-[#34C759]/20'
            )}
            disabled={isDeletingDepartment}
          />
        </div>
      </div>
    </MinimalModal>
  );
}
