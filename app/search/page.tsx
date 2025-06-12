"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import NewsCard from "@/components/news-card"
import { searchNews } from "@/lib/news-service"
import type { Article } from "@/types/article"
import { motion } from "framer-motion"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (searchTerm) {
      const fetchResults = async () => {
        setLoading(true)
        setError(null)

        try {
          const results = await searchNews(searchTerm)
          setArticles(results)
        } catch (err) {
          setError("Failed to fetch search results. Please try again.")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }

      fetchResults()
    }
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(query)

    // Update URL with search query
    const url = new URL(window.location.href)
    url.searchParams.set("q", query)
    window.history.pushState({}, "", url)
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

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Search News</h1>

      <form onSubmit={handleSearch} className="flex w-full max-w-lg mb-8 space-x-2">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={loading || !query.trim()}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </form>

      {searchTerm && !loading && !error && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {articles.length > 0 ? `Results for "${searchTerm}"` : `No results found for "${searchTerm}"`}
          </h2>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      )}

      {error && <div className="p-4 text-red-500 border border-red-300 rounded-md bg-red-500/10">{error}</div>}

      {!loading && !error && articles.length > 0 && (
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
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
      )}

      {!loading && !error && searchTerm && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="w-16 h-16 mb-4 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">No results found</h2>
          <p className="text-muted-foreground">Try different keywords or check your spelling</p>
        </div>
      )}
    </div>
  )
}
