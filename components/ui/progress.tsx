import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-200', className)}
        {...props}
      >
        <div
          className="h-full bg-[#3F51B5] transition-all"
          style={{ width: `${value ?? 0}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = 'Progress'

export { Progress }
