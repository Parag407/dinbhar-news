import { type NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.NEWS_API_KEY // Server-side only, no NEXT_PUBLIC prefix
const BASE_URL = "https://newsapi.org/v2"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const country = searchParams.get("country") || "us"
  const category = searchParams.get("category") || "general"
  const page = searchParams.get("page") || "1"

  if (!API_KEY) {
    return NextResponse.json({ error: "NewsAPI key not configured" }, { status: 500 })
  }

  try {
    const pageSize = 10
    const url = `${BASE_URL}/top-headlines?country=${country}&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "DinBhar-News-App/1.0",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("NewsAPI Error:", response.status, data)

      // Return fallback data for common errors
      if (response.status === 426 || response.status === 429) {
        return NextResponse.json({
          articles: getFallbackArticles(),
          totalResults: 10,
          status: "ok",
        })
      }

      return NextResponse.json(
        { error: `NewsAPI error: ${response.status} - ${data.message || response.statusText}` },
        { status: response.status },
      )
    }

    if (data.status !== "ok") {
      return NextResponse.json({ error: `NewsAPI error: ${data.message}` }, { status: 400 })
    }

    // Filter out removed articles and transform data
    const filteredArticles = data.articles
      .filter((article: any) => article.title && article.title !== "[Removed]")
      .map((article: any, index: number) => transformArticle(article, index))

    return NextResponse.json({
      articles: filteredArticles,
      totalResults: data.totalResults,
      status: "ok",
    })
  } catch (error) {
    console.error("Failed to fetch news:", error)

    // Return fallback data on network errors
    return NextResponse.json({
      articles: getFallbackArticles(),
      totalResults: 10,
      status: "ok",
    })
  }
}

function transformArticle(apiArticle: any, index: number) {
  return {
    id: apiArticle.url
      ? Buffer.from(apiArticle.url).toString("base64")
          .replace(/[^a-zA-Z0-9]/g, "")
      : `article-${index}`,
    title: apiArticle.title || "No title available",
    description: apiArticle.description || "No description available",
    content: apiArticle.content || apiArticle.description || "Content not available",
    url: apiArticle.url || "",
    urlToImage: apiArticle.urlToImage,
    publishedAt: apiArticle.publishedAt || new Date().toISOString(),
    author: apiArticle.author,
    source: {
      id: apiArticle.source?.id || null,
      name: apiArticle.source?.name || "Unknown Source",
    },
  }
}

function getFallbackArticles() {
  return [
    {
      id: "fallback-1",
      title: "Welcome to DinBhar News",
      description: "Your trusted source for the latest news and updates from around the world.",
      content:
        "We're currently experiencing high traffic. Please try again in a few moments for the latest news updates.",
      url: "",
      urlToImage: "/placeholder.svg?height=400&width=600",
      publishedAt: new Date().toISOString(),
      author: "DinBhar Team",
      source: {
        id: "dinbhar",
        name: "DinBhar News",
      },
    },
    {
      id: "fallback-2",
      title: "Stay Updated with Breaking News",
      description: "Get the latest headlines, breaking news, and in-depth analysis from trusted sources.",
      content:
        "Our news service is temporarily unavailable due to high demand. We're working to restore full service shortly.",
      url: "",
      urlToImage: "/placeholder.svg?height=400&width=600",
      publishedAt: new Date().toISOString(),
      author: "News Team",
      source: {
        id: "dinbhar",
        name: "DinBhar News",
      },
    },
  ]
}
