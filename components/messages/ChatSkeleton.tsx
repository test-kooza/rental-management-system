import { Skeleton } from "@/components/ui/skeleton"

export function ChatSkeleton() {
  return (
    <div className="flex flex-col w-full md:w-3/4">
      <div className="flex items-center p-4 border-b">
        <Skeleton className="h-10 w-10 rounded-full mr-3" />
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
            <div className="flex items-end gap-2 max-w-[75%]">
              {i % 2 === 0 && <Skeleton className="h-7 w-7 rounded-full" />}
              <Skeleton className={`h-16 ${i % 2 === 0 ? "w-48" : "w-64"} rounded-lg`} />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <Skeleton className="h-20 w-full rounded-md" />
      </div>
    </div>
  )
}

