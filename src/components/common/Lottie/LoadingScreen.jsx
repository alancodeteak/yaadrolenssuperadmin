import clsx from 'clsx';
import LottieLoader from './LottieLoader';

const LoadingScreen = ({
  message = 'Loading...',
  fullScreen = true,
  size = 'lg',
  className,
}) => (
  <div
    className={clsx(
      'flex items-center justify-center bg-gray-50',
      fullScreen ? 'min-h-screen' : 'py-12',
      className
    )}
  >
    <LottieLoader size={size} label={message} centered />
  </div>
);

export default LoadingScreen;
