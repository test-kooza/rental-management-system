import { BookingListLoading } from "./BookingList";

export function BookingTabsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-7 w-40 animate-pulse rounded bg-muted"></div>
        <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
      </div>
      <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
      <BookingListLoading />
    </div>
  )
}

