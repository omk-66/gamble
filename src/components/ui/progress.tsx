import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <div className="relative">
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          "bg-green-500/70 relative h-4 w-full overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="bg-red-500/70 h-full w-full flex-1 transition-all"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      
      <div 
        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-primary rounded-sm cursor-not-allowed"
        style={{ left: `${value || 0}%`, transform: `translate(-50%, -50%)` }}
      />
    </div>
  )
}

export { Progress }
