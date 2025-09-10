import React from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'glass' | 'elevated' | 'gradient'
  border?: boolean
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
  divider?: boolean
}

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
  divider?: boolean
}

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>
  Body: React.FC<CardBodyProps>
  Footer: React.FC<CardFooterProps>
} = ({ 
  children, 
  className, 
  hover = false,
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  variant = 'default',
  border = true
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-xl',
    xl: 'shadow-2xl',
  }

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
  }

  const variantClasses = {
    default: 'bg-white',
    glass: 'bg-white/80 backdrop-blur-sm',
    elevated: 'bg-gradient-to-br from-white to-gray-50',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
  }

  const borderClasses = border ? 'border border-gray-200/60' : ''
  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group' : 'transition-all duration-200'

  return (
    <div
      className={clsx(
        'relative overflow-hidden',
        variantClasses[variant],
        paddingClasses[padding],
        shadowClasses[shadow],
        roundedClasses[rounded],
        borderClasses,
        hoverClasses,
        className
      )}
    >
      {/* Decorative gradient overlay for glass effect */}
      {variant === 'glass' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      )}
      
      {/* Hover glow effect */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className, divider = true }) => {
  return (
    <div className={clsx(
      'mb-6',
      {
        'pb-4 border-b border-gray-200': divider,
      },
      className
    )}>
      {children}
    </div>
  )
}

const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return (
    <div className={clsx('flex-1', className)}>
      {children}
    </div>
  )
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className, divider = true }) => {
  return (
    <div className={clsx(
      'mt-6',
      {
        'pt-4 border-t border-gray-200': divider,
      },
      className
    )}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card
