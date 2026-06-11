import { cssTransition } from 'react-toastify';

export const dashboardToastTransition = cssTransition({
  enter: 'dashboard-toast-enter',
  exit: 'dashboard-toast-exit-none',
  collapse: false,
});
