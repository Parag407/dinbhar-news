"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getFeaturedArticle } from "@/lib/news-service"
import type { Article } from "@/types/article"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Hero() {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedArticle = async () => {
      try {
        const data = await getFeaturedArticle()
        setArticle(data)
      } catch (error) {
        console.error("Failed to fetch featured article:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedArticle()
  }, [])

  if (loading) {
    return (
      <div className="relative w-full overflow-hidden rounded-lg bg-card h-[400px] animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="w-3/4 h-8 mb-2 rounded bg-muted" />
          <div className="w-1/2 h-6 mb-4 rounded bg-muted" />
          <div className="w-32 h-10 rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (!article) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full overflow-hidden rounded-lg h-[400px] group"
    >
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
        <Image
          src={article.urlToImage || "/placeholder.svg?height=400&width=800"}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-secondary/90 text-secondary-foreground">
          Featured
        </span>
        <h2 className="mb-2 text-2xl font-bold leading-tight text-white md:text-3xl">{article.title}</h2>
        <p className="mb-4 text-white/90 line-clamp-2">{article.description}</p>
        <Button asChild>
          <Link href={`/article/${article.id}`} className="group">
            Read Article
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}
