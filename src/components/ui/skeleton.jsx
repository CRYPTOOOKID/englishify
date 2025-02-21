import { cn } from "../../lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function SkeletonCircle({
  className,
  size = "12",
  ...props
}) {
  return (
    <Skeleton
      className={cn(`h-${size} w-${size} rounded-full`, className)}
      {...props}
    />
  )
}

export { Skeleton, SkeletonCircle }