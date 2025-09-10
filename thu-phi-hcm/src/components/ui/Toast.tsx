import React, { useEffect, useState } from 'react'
import { clsx } from 'clsx'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const showTimer = setTimeout(() => setIsVisible(true), 100)
    
    // Auto close after duration
    const closeTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(closeTimer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  const typeConfig = {
    success: {
      icon: '✅',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      borderColor: 'border-green-200',
      textColor: 'text-white',
      progressColor: 'bg-green-300'
    },
    error: {
      icon: '❌',
      bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
      borderColor: 'border-red-200',
      textColor: 'text-white',
      progressColor: 'bg-red-300'
    },
    warning: {
      icon: '⚠️',
      bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
      borderColor: 'border-yellow-200',
      textColor: 'text-gray-900',
      progressColor: 'bg-yellow-600'
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      borderColor: 'border-blue-200',
      textColor: 'text-white',
      progressColor: 'bg-blue-300'
    }
  }

  const config = typeConfig[type]

  return (
    <div
      className={clsx(
        'relative max-w-sm w-full rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 ease-out',
        config.bgColor,
        config.borderColor,
        'border-2',
        {
          'translate-x-0 opacity-100 scale-100': isVisible && !isExiting,
          'translate-x-full opacity-0 scale-95': !isVisible || isExiting,
        }
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0 text-2xl">
            {config.icon}
          </div>
          
          {/* Text content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={clsx('text-sm font-bold mb-1', config.textColor)}>
                {title}
              </h4>
            )}
            <p className={clsx('text-sm', config.textColor, { 'opacity-90': title })}>
              {message}
            </p>
          </div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className={clsx(
              'flex-shrink-0 p-1 rounded-lg transition-colors duration-200',
              config.textColor,
              'hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50'
            )}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-black/20 w-full">
        <div
          className={clsx(
            'h-full transition-all duration-300 ease-linear',
            config.progressColor
          )}
          style={{
            width: isVisible && !isExiting ? '0%' : '100%',
            transition: `width ${duration}ms linear`
          }}
        />
      </div>
    </div>
  )
}

export default Toast
