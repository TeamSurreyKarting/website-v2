import { cn } from "@/lib/utils";

export const SVGSkeleton = ({ className }: { className?: string }) => (
  <svg className={cn("animate-pulse rounded bg-gray-300", className)} />
);
