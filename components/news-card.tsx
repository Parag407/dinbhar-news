"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useBookmarks } from "@/context/bookmarks-context"
import type { Article } from "@/types/article"
import ShareModal from "@/components/share-modal"
import { motion } from "framer-motion"
import Image from "next/image"

interface NewsCardProps {
  article: Article
  actions?: React.ReactNode
}

export default function NewsCard({ article, actions }: NewsCardProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks()

  const isBookmarked = bookmarks.some((bookmark) => bookmark.id === article.id)

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isBookmarked) {
      removeBookmark(article.id)
    } else {
      addBookmark(article)
    }
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsShareModalOpen(true)
  }

  return (
    <>
      <Link href={`/article/${article.id}`}>
        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="overflow-hidden transition-all border hover:border-secondary/50 hover:shadow-md hover:shadow-secondary/5">
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={article.urlToImage || "/placeholder.svg?height=200&width=400"}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {article.source?.name && (
                  <span className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                    {article.source.name}
                  </span>
                )}
              </div>
              <h3 className="mb-2 text-lg font-semibold line-clamp-2">{article.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{article.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
              {actions || (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmarkToggle}
                    className="transition-all hover:text-secondary"
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-secondary text-secondary" : ""}`} />
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShareClick}
                    className="transition-all hover:text-secondary"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </Link>

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} article={article} />
    </>
  )
}
