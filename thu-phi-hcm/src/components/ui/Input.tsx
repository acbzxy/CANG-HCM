import React, { useState } from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  icon?: React.ReactNode
  fullWidth?: boolean
  variant?: 'default' | 'modern' | 'floating'
  showPasswordToggle?: boolean
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  icon,
  fullWidth = true,
  variant = 'modern',
  showPasswordToggle = false,
  className,
  id,
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type

  const baseInputClasses = 'w-full transition-all duration-300 focus:outline-none'
  
  const variantClasses = {
    default: 'px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
    modern: 'px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
    floating: 'px-4 pt-6 pb-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
  }

  const errorClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50' 
    : ''

  const iconPadding = icon ? 'pl-12' : ''
  const passwordTogglePadding = showPasswordToggle ? 'pr-12' : ''

  return (
    <div className={clsx('space-y-2', { 'w-full': fullWidth })}>
      {/* Label for non-floating variants */}
      {label && variant !== 'floating' && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input container */}
      <div className="relative group">
        {/* Icon */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-gray-500 transition-colors duration-200">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          id={inputId}
          type={inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={clsx(
            baseInputClasses,
            variantClasses[variant],
            errorClasses,
            iconPadding,
            passwordTogglePadding,
            {
              'placeholder-transparent': variant === 'floating',
            },
            className
          )}
          {...props}
        />

        {/* Floating label */}
        {label && variant === 'floating' && (
          <label
            htmlFor={inputId}
            className={clsx(
              'absolute left-4 transition-all duration-200 pointer-events-none',
              {
                'top-2 text-xs text-blue-600 font-medium': isFocused || props.value,
                'top-4 text-gray-500': !isFocused && !props.value,
              }
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Password toggle button */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}

        {/* Focus ring animation */}
        <div className={clsx(
          'absolute inset-0 rounded-xl border-2 border-blue-500 opacity-0 scale-105 transition-all duration-200 pointer-events-none',
          {
            'opacity-20 scale-100': isFocused && !error,
          }
        )}></div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center space-x-1 animate-fade-in">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-600 font-medium">
            {error}
          </p>
        </div>
      )}

      {/* Help text */}
      {helpText && !error && (
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-500">
            {helpText}
          </p>
        </div>
      )}
    </div>
  )
}

export default Input
