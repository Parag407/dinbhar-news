import { type NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.NEWS_API_KEY
const BASE_URL = "https://newsapi.org/v2"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 })
  }

  if (!API_KEY) {
    return NextResponse.json({ error: "NewsAPI key not configured" }, { status: 500 })
  }

  try {
    const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "DinBhar-News-App/1.0",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("NewsAPI Search Error:", response.status, data)

      if (response.status === 426 || response.status === 429) {
        return NextResponse.json({
          articles: [],
          totalResults: 0,
          status: "ok",
          message: "Search temporarily unavailable due to high traffic. Please try again later.",
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

    const filteredArticles = data.articles
      .filter((article: any) => article.title && article.title !== "[Removed]")
      .map((article: any, index: number) => transformArticle(article, index))

    return NextResponse.json({
      articles: filteredArticles,
      totalResults: data.totalResults,
      status: "ok",
    })
  } catch (error) {
    console.error("Failed to search news:", error)

    return NextResponse.json({
      articles: [],
      totalResults: 0,
      status: "ok",
      message: "Search temporarily unavailable. Please try again later.",
    })
  }
}

function transformArticle(apiArticle: any, index: number) {
  return {
    id: apiArticle.url
      ? btoa(apiArticle.url)
          .replace(/[^a-zA-Z0-9]/g, "")
          .substring(0, 10) + index
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
