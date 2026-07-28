import { forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(({ className, label, error, options = [], placeholder, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
        {label}
      </label>
    )}
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'w-full appearance-none rounded-lg border border-secondary-300 bg-white px-3 py-2 pr-10 text-sm text-secondary-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-700 dark:bg-secondary-900 dark:text-secondary-100',
          error && 'border-danger-500',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
    </div>
    {error && <p className="mt-1 text-sm text-danger-500">{error}</p>}
  </div>
))

Select.displayName = 'Select'
export default Select
