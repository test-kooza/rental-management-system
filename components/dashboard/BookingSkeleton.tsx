import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function BookingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 mb-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-64 mt-4" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Form */}
          <div className="w-full lg:w-[65%]">
            <div className="mb-8">
              <Skeleton className="h-6 w-32 mb-6" />

              <div className="border-b pb-6 mb-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-4 w-10" />
                </div>

                <div className="flex justify-between">
                  <div>
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>

              <Skeleton className="h-6 w-40 mb-4" />

              <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>

              <Skeleton className="h-6 w-40 mt-8 mb-4" />

              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />

                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>

                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>

              <div className="border-t my-8"></div>

              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-16 w-full" />

              <div className="border-t my-8"></div>

              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3 mt-2" />

              <Skeleton className="h-4 w-full mt-8 mb-8" />

              <Skeleton className="h-12 w-40" />
            </div>
          </div>

          {/* Right column - Price details */}
          <div className="w-full lg:w-[35%] lg:relative hidden md:block">
            <div className="lg:sticky lg:top-32">
              <Card className="shadow-lg border rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6 pb-6 border-b">
                      <Skeleton className="w-20 h-20 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-3 w-full mb-1" />
                        <Skeleton className="h-3 w-3/4 mb-1" />
                        <Skeleton className="h-3 w-1/2 mt-1" />
                      </div>
                    </div>

                    <Skeleton className="h-5 w-32 mb-4" />

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>

                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-20" />
                      </div>

                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>

                      <div className="flex justify-between pt-4 border-t">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

