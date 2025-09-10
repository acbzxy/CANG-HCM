import React from 'react'
import { clsx } from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gradient' | 'outline'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 transform active:scale-95'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500/50 shadow-lg hover:shadow-xl disabled:from-blue-300 disabled:to-blue-300',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 focus:ring-gray-500/50 shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-300',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500/50 shadow-lg hover:shadow-xl disabled:from-green-300 disabled:to-green-300',
    warning: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-600 focus:ring-yellow-500/50 shadow-lg hover:shadow-xl disabled:from-yellow-300 disabled:to-yellow-300',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500/50 shadow-lg hover:shadow-xl disabled:from-red-300 disabled:to-red-300',
    info: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 focus:ring-cyan-500/50 shadow-lg hover:shadow-xl disabled:from-cyan-300 disabled:to-cyan-300',
    gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-red-600 focus:ring-purple-500/50 shadow-lg hover:shadow-xl disabled:from-purple-300 disabled:via-pink-300 disabled:to-red-300',
    outline: 'border-2 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white focus:ring-blue-500/50 disabled:border-blue-300 disabled:text-blue-300'
  }
  
  const sizeClasses = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }
  
  const widthClasses = fullWidth ? 'w-full' : ''
  
  const isDisabled = disabled || loading

  const renderIcon = () => {
    if (loading) {
      return (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )
    }
    return icon
  }

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        widthClasses,
        {
          'cursor-not-allowed opacity-50': isDisabled,
          'hover:scale-105': !isDisabled,
        },
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {(icon || loading) && iconPosition === 'left' && (
        <span className={clsx('flex items-center', children && 'mr-2')}>
          {renderIcon()}
        </span>
      )}
      
      {loading ? 'Đang xử lý...' : children}
      
      {(icon || loading) && iconPosition === 'right' && (
        <span className={clsx('flex items-center', children && 'ml-2')}>
          {renderIcon()}
        </span>
      )}
    </button>
  )
}

export default Button
