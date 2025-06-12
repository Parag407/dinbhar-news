"use client"

import { useState, useEffect } from "react"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ApiStatusBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [apiStatus, setApiStatus] = useState<"checking" | "ok" | "limited" | "error">("checking")

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch("/api/news?country=us&category=general&page=1")
        const data = await response.json()

        if (response.ok && data.articles && data.articles.length > 0) {
          // Check if we're getting fallback articles
          const isFallback = data.articles.some((article: any) => article.id.startsWith("fallback"))
          setApiStatus(isFallback ? "limited" : "ok")
          setShowBanner(isFallback)
        } else {
          setApiStatus("error")
          setShowBanner(true)
        }
      } catch (error) {
        setApiStatus("error")
        setShowBanner(true)
      }
    }

    checkApiStatus()
  }, [])

  if (!showBanner || apiStatus === "ok") {
    return null
  }

  return (
    <div className="bg-orange-500/10 border-b border-orange-500/20">
      <div className="container flex items-center justify-between px-4 py-3 mx-auto">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <span className="text-sm">
            {apiStatus === "limited"
              ? "NewsAPI rate limit reached. Showing cached content. Service will resume tomorrow."
              : "News service temporarily unavailable. Please try again later."}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowBanner(false)}
          className="text-orange-500 hover:text-orange-600"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
