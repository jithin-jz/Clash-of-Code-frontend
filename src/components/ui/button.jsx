import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-[0.01em] transition-[transform,background-color,border-color,color,box-shadow,opacity,filter] duration-200 ease-out active:scale-[0.985] will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 disabled:pointer-events-none disabled:opacity-55 disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(180deg,hsl(var(--primary))_0%,hsl(var(--primary)/0.86)_100%)] text-primary-foreground shadow-[0_10px_24px_hsl(var(--primary)/0.28)] hover:brightness-[1.05]",
        destructive:
          "bg-[linear-gradient(180deg,hsl(var(--destructive))_0%,hsl(var(--destructive)/0.88)_100%)] text-destructive-foreground shadow-[0_10px_24px_hsl(var(--destructive)/0.3)] hover:brightness-[1.04]",
        outline:
          "border border-border/80 bg-background/70 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-secondary/70",
        secondary:
          "bg-secondary/95 text-secondary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-secondary/75",
        ghost: "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
