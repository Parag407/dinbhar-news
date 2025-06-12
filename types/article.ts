export interface Article {
  id: string
  title: string
  description: string
  content: string
  url: string
  urlToImage: string | null
  publishedAt: string
  author: string | null
  source: {
    id: string | null
    name: string
  }
}
