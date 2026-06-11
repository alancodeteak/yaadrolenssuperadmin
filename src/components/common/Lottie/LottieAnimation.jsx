import Lottie from 'lottie-react';
import clsx from 'clsx';
import faceScanAnimation from '../../../assets/animations/face-scan.json';

const LottieAnimation = ({
  animationData = faceScanAnimation,
  loop = true,
  autoplay = true,
  className,
  style,
}) => (
  <Lottie
    animationData={animationData}
    loop={loop}
    autoplay={autoplay}
    className={clsx(className)}
    style={style}
  />
);

export default LottieAnimation;
