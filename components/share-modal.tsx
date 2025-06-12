"use client"

import { useState } from "react"
import { Check, Copy, Facebook, Link, Twitter } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Article } from "@/types/article"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  article: Article
}

export default function ShareModal({ isOpen, onClose, article }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/article/${article.id}` : `/article/${article.id}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${article.title} | DinBhar News`)
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${text}`, "_blank")
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Article</DialogTitle>
          <DialogDescription>Share this article with your friends and colleagues</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input value={shareUrl} readOnly className="w-full" />
          </div>
          <Button size="sm" className="px-3" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="sr-only">Copy</span>
          </Button>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="outline" size="icon" className="rounded-full" onClick={shareToTwitter}>
            <Twitter className="w-4 h-4" />
            <span className="sr-only">Share on Twitter</span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={shareToFacebook}>
            <Facebook className="w-4 h-4" />
            <span className="sr-only">Share on Facebook</span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={handleCopy}>
            <Link className="w-4 h-4" />
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
