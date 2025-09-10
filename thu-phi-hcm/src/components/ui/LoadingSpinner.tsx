import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = '#3498db',
  text = 'Đang tải...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Modern Spinner */}
        <div className="relative">
          <div 
            className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200`}
            style={{ borderTopColor: color }}
          ></div>
          <div 
            className={`${sizeClasses[size]} absolute top-0 left-0 animate-pulse rounded-full border-4 border-transparent`}
            style={{ borderTopColor: color, opacity: 0.3 }}
          ></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-gray-600 font-medium animate-pulse">{text}</p>
          <div className="flex space-x-1 justify-center mt-2">
            <div 
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ backgroundColor: color, animationDelay: '0ms' }}
            ></div>
            <div 
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ backgroundColor: color, animationDelay: '150ms' }}
            ></div>
            <div 
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ backgroundColor: color, animationDelay: '300ms' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
