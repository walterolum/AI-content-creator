import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(({ className, label, error, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
        {label}
      </label>
    )}
    <input
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-700 dark:bg-secondary-900 dark:text-secondary-100 dark:placeholder:text-secondary-500',
        error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20',
        className
      )}
      {...props}
    />
    {error && (
      <p className="mt-1 text-sm text-danger-500">{error}</p>
    )}
  </div>
))

Input.displayName = 'Input'
export default Input
