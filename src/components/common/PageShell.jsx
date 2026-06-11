import { PAGE_SHELL_CLASS } from '../../theme/dashboardTheme';

export default function PageShell({ children, className = '' }) {
  return (
    <div className={`${PAGE_SHELL_CLASS} ${className}`.trim()}>
      {children}
    </div>
  );
}
