import { cn } from '../../lib/utils'

export default function Card({ className, children, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900',
        hover && 'transition-all duration-200 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('text-lg font-semibold text-secondary-900 dark:text-secondary-100', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-sm text-secondary-500 dark:text-secondary-400', className)} {...props}>
      {children}
    </p>
  )
}
