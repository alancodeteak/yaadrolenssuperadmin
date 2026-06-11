import clsx from 'clsx';
import ButtonSpinner from './ButtonSpinner/ButtonSpinner';
import {
  DASHBOARD_BTN_DESTRUCTIVE,
  DASHBOARD_BTN_PRIMARY,
  DASHBOARD_BTN_SECONDARY,
} from '../../theme/dashboardTheme';

export default function FormButton({
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  children,
  className = '',
}) {
  const variantClasses = {
    primary: DASHBOARD_BTN_PRIMARY,
    secondary: DASHBOARD_BTN_SECONDARY,
    outline: DASHBOARD_BTN_SECONDARY,
    danger: DASHBOARD_BTN_DESTRUCTIVE,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(variantClasses[variant] || DASHBOARD_BTN_PRIMARY, className)}
    >
      {loading && <ButtonSpinner size="sm" className={variant === 'outline' ? 'text-gray-600' : 'text-white'} />}
      {children}
    </button>
  );
}
