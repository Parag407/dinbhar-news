import type { Article } from "@/types/article"

// Client-side service that calls our API routes
export async function getNews(country = "us", category = "general", page = 1): Promise<Article[]> {
  try {
    const response = await fetch(`/api/news?country=${country}&category=${category}&page=${page}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.articles || []
  } catch (error) {
    console.error("Failed to fetch news:", error)
    return getFallbackArticles()
  }
}

export async function getFeaturedArticle(): Promise<Article | null> {
  try {
    const articles = await getNews("us", "general", 1)
    return articles.length > 0 ? articles[0] : null
  } catch (error) {
    console.error("Failed to fetch featured article:", error)
    return getFallbackFeaturedArticle()
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    // Since NewsAPI doesn't provide individual article endpoints,
    // we'll search through recent articles
    const articles = await getNews("us", "general", 1)
    return articles.find((article) => article.id === id) || null
  } catch (error) {
    console.error("Failed to fetch article:", error)
    return null
  }
}

export async function searchNews(query: string): Promise<Article[]> {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.message) {
      // Show user-friendly message for API limitations
      console.warn(data.message)
    }

    return data.articles || []
  } catch (error) {
    console.error("Failed to search news:", error)
    return []
  }
}

// Fallback articles when API is unavailable
function getFallbackArticles(): Article[] {
  return [
    {
      id: "fallback-1",
      title: "Welcome to DinBhar News",
      description: "Your trusted source for the latest news and updates from around the world.",
      content:
        "We're currently experiencing high traffic or API limitations. Please try again in a few moments for the latest news updates. In the meantime, you can explore our bookmarked articles or try searching for specific topics.",
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
        "Our news service is temporarily limited due to API restrictions. We're working to provide you with the best news experience. Please bookmark articles you're interested in and check back soon for updates.",
      url: "",
      urlToImage: "/placeholder.svg?height=400&width=600",
      publishedAt: new Date().toISOString(),
      author: "News Team",
      source: {
        id: "dinbhar",
        name: "DinBhar News",
      },
    },
    {
      id: "fallback-3",
      title: "NewsAPI Rate Limit Information",
      description: "Understanding API limitations and how we handle them.",
      content:
        "The free tier of NewsAPI has a limit of 1,000 requests per day. When this limit is reached, we show fallback content to ensure you can still use the website. Consider upgrading to a paid NewsAPI plan for unlimited access, or try again tomorrow when the limit resets.",
      url: "https://newsapi.org/pricing",
      urlToImage: "/placeholder.svg?height=400&width=600",
      publishedAt: new Date().toISOString(),
      author: "Technical Team",
      source: {
        id: "dinbhar",
        name: "DinBhar News",
      },
    },
  ]
}

function getFallbackFeaturedArticle(): Article {
  return {
    id: "featured-fallback",
    title: "DinBhar News - Your Daily News Companion",
    description: "Experience the best in news aggregation with our elegant, user-friendly interface.",
    content:
      "Welcome to DinBhar News! We're currently experiencing high API traffic, but you can still explore our features including bookmarking, sharing, and searching. Our service will be back to full capacity soon.",
    url: "",
    urlToImage: "/placeholder.svg?height=400&width=800",
    publishedAt: new Date().toISOString(),
    author: "DinBhar Team",
    source: {
      id: "dinbhar",
      name: "DinBhar News",
    },
  }
}
