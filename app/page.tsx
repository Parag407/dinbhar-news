import { Suspense } from "react"
import Hero from "@/components/hero"
import NewsList from "@/components/news-list"
import NewsFilters from "@/components/news-filters"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <Hero />
      <div className="mt-8">
        <NewsFilters />
        <Suspense fallback={<NewsListSkeleton />}>
          <NewsList />
        </Suspense>
      </div>
    </div>
  )
}

function NewsListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="overflow-hidden border rounded-lg border-border">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="w-3/4 h-6 mb-2" />
              <Skeleton className="w-full h-4 mb-1" />
              <Skeleton className="w-full h-4 mb-1" />
              <Skeleton className="w-2/3 h-4 mb-4" />
              <div className="flex justify-between">
                <Skeleton className="w-20 h-8" />
                <Skeleton className="w-20 h-8" />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
