import Lottie from 'lottie-react'
import faceScanAnimation from '../../assets/animations/face-scan.json'

export default function LoadingSpinner({ 
  size = 'default', 
  text = 'Loading...', 
  className = '',
  showText = true
}) {
  const sizeClasses = {
    small: 'w-16 h-16',
    default: 'w-24 h-24',
    large: 'w-32 h-32'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <Lottie
        animationData={faceScanAnimation}
        loop={true}
        autoplay={true}
        className={sizeClasses[size]}
      />
      {showText && (
        <p className="text-gray-600 text-sm font-medium">{text}</p>
      )}
    </div>
  )
}