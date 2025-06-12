"use client"
import { useRouter } from "next/navigation"
import { Bookmark, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBookmarks } from "@/context/bookmarks-context"
import NewsCard from "@/components/news-card"
import { motion } from "framer-motion"

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks()
  const router = useRouter()

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Bookmarks</h1>
          <p className="text-muted-foreground">
            {bookmarks.length} {bookmarks.length === 1 ? "article" : "articles"} saved
          </p>
        </div>
        <Button variant="ghost" onClick={() => router.push("/")} className="transition-all hover:text-secondary">
          Back to news
        </Button>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bookmark className="w-16 h-16 mb-4 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">No bookmarks yet</h2>
          <p className="mb-6 text-muted-foreground">Save articles to read them later or keep them for reference</p>
          <Button onClick={() => router.push("/")}>Browse articles</Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {bookmarks.map((article) => (
            <motion.div key={article.id} variants={item}>
              <NewsCard
                article={article}
                actions={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeBookmark(article.id)
                    }}
                    className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                }
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
