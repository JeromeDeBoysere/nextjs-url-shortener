import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground",
        "transition-all duration-150",
        "placeholder:text-muted-foreground",
        "focus:border-ring focus:outline-none focus:shadow-[0_0_0_0.2rem_rgba(0,123,255,0.25)]",
        "aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_0.2rem_rgba(220,53,69,0.25)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
