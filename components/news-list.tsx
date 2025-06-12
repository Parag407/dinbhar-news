"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import NewsCard from "@/components/news-card"
import { getNews } from "@/lib/news-service"
import type { Article } from "@/types/article"
import { motion } from "framer-motion"

export default function NewsList() {
  const searchParams = useSearchParams()
  const country = searchParams.get("country") || "us"
  const category = searchParams.get("category") || "general"

  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      setPage(1)

      try {
        const data = await getNews(country, category, 1)
        setArticles(data)
        setHasMore(data.length === 10) // Assuming 10 articles per page
      } catch (err) {
        setError("Failed to fetch news. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [country, category])

  const loadMore = async () => {
    if (loadingMore) return

    setLoadingMore(true)

    try {
      const nextPage = page + 1
      const data = await getNews(country, category, nextPage)

      if (data.length === 0) {
        setHasMore(false)
      } else {
        setArticles((prev) => [...prev, ...data])
        setPage(nextPage)
        setHasMore(data.length === 10) // Assuming 10 articles per page
      }
    } catch (err) {
      console.error("Failed to load more articles:", err)
    } finally {
      setLoadingMore(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500 border border-red-300 rounded-md bg-red-500/10">{error}</div>
  }

  if (articles.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-xl font-semibold">No articles found</h3>
        <p className="text-muted-foreground">Try changing your filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {articles.map((article) => (
          <motion.div key={article.id} variants={item}>
            <NewsCard article={article} />
          </motion.div>
        ))}
      </motion.div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={loadMore}
            disabled={loadingMore}
            variant="outline"
            className="transition-all hover:border-secondary hover:text-secondary"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
