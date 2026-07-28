import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
  secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 dark:bg-secondary-800 dark:text-secondary-100 dark:hover:bg-secondary-700',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950',
  ghost: 'text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 shadow-sm',
  success: 'bg-success-600 text-white hover:bg-success-700 shadow-sm',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
}

const Button = forwardRef(({ className, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
      variants[variant],
      sizes[size],
      className
    )}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
))

Button.displayName = 'Button'
export default Button
