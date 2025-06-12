"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useBookmarks } from "@/context/bookmarks-context"
import { getArticleById } from "@/lib/news-service"
import type { Article } from "@/types/article"
import ShareModal from "@/components/share-modal"
import Image from "next/image"

export default function ArticlePage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks()

  const isBookmarked = bookmarks.some((bookmark) => bookmark.id === id)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id)
        setArticle(data)
      } catch (error) {
        console.error("Failed to fetch article:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  const handleBookmarkToggle = () => {
    if (!article) return

    if (isBookmarked) {
      removeBookmark(article.id)
    } else {
      addBookmark(article)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  if (loading) {
    return <ArticleSkeleton />
  }

  if (!article) {
    return (
      <div className="container px-4 py-16 mx-auto text-center">
        <h1 className="text-3xl font-bold">Article not found</h1>
        <Button onClick={handleGoBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Go back
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto animate-fade-in">
      <Button variant="ghost" onClick={handleGoBack} className="mb-6 transition-transform hover:translate-x-[-4px]">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to news
      </Button>

      <div className="max-w-3xl mx-auto">
        <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">{article.title}</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {article.author && ` • By ${article.author}`}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmarkToggle}
              className="transition-all hover:text-secondary hover:border-secondary"
            >
              <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-secondary text-secondary" : ""}`} />
              {isBookmarked ? "Saved" : "Save"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
              className="transition-all hover:text-secondary hover:border-secondary"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {article.urlToImage && (
          <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg md:h-96">
            <Image src={article.urlToImage || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed">{article.description}</p>
          <p className="leading-relaxed">{article.content}</p>

          {article.url && (
            <div className="mt-8">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-secondary hover:underline"
              >
                Read full article on {new URL(article.url).hostname.replace("www.", "")}
              </a>
            </div>
          )}
        </div>
      </div>

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} article={article} />
    </div>
  )
}

function ArticleSkeleton() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <Skeleton className="w-24 h-10 mb-6" />

      <div className="max-w-3xl mx-auto">
        <Skeleton className="w-full h-12 mb-4" />

        <div className="flex items-center justify-between mb-6">
          <Skeleton className="w-48 h-5" />
          <div className="flex space-x-2">
            <Skeleton className="w-24 h-9" />
            <Skeleton className="w-24 h-9" />
          </div>
        </div>

        <Skeleton className="w-full h-64 mb-6 md:h-96" />

        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-3/4 h-6 mb-6" />

        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-2/3 h-6" />
      </div>
    </div>
  )
}
