"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Article } from "@/types/article"

interface BookmarksContextType {
  bookmarks: Article[]
  addBookmark: (article: Article) => void
  removeBookmark: (id: string) => void
  clearBookmarks: () => void
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined)

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Article[]>([])

  // Load bookmarks from localStorage on initial render
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("dinbhar-bookmarks")
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks))
      } catch (error) {
        console.error("Failed to parse bookmarks:", error)
        localStorage.removeItem("dinbhar-bookmarks")
      }
    }
  }, [])

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dinbhar-bookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  const addBookmark = (article: Article) => {
    setBookmarks((prev) => {
      // Check if article is already bookmarked
      if (prev.some((bookmark) => bookmark.id === article.id)) {
        return prev
      }
      return [...prev, article]
    })
  }

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id))
  }

  const clearBookmarks = () => {
    setBookmarks([])
  }

  return (
    <BookmarksContext.Provider value={{ bookmarks, addBookmark, removeBookmark, clearBookmarks }}>
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarks() {
  const context = useContext(BookmarksContext)
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarksProvider")
  }
  return context
}
