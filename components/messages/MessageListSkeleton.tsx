import { Skeleton } from "@/components/ui/skeleton"

export function MessageListSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <Skeleton className="h-9 w-full" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center p-4 border-b">
            <Skeleton className="h-10 w-10 rounded-full mr-3" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

