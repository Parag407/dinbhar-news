"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { countries, categories } from "@/lib/filter-options"

export default function NewsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCountry = searchParams.get("country") || "us"
  const currentCategory = searchParams.get("category") || "general"

  const [selectedCountry, setSelectedCountry] = useState(currentCountry)
  const [selectedCategory, setSelectedCategory] = useState(currentCategory)

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value)
    updateFilters(value, selectedCategory)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    updateFilters(selectedCountry, value)
  }

  const updateFilters = (country: string, category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("country", country)
    params.set("category", category)

    router.push(`/?${params.toString()}`)
  }

  const getCountryName = (code: string) => {
    return countries.find((country) => country.code === code)?.name || "United States"
  }

  const getCategoryName = (value: string) => {
    return categories.find((category) => category.value === value)?.label || "General"
  }

  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <h2 className="text-2xl font-bold">Latest News</h2>

      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <span>Country: {getCountryName(selectedCountry)}</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Country</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
              {countries.map((country) => (
                <DropdownMenuItem
                  key={country.code}
                  onClick={() => handleCountryChange(country.code)}
                  className="flex items-center justify-between"
                >
                  {country.name}
                  {selectedCountry === country.code && <Check className="w-4 h-4 ml-2" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <span>Category: {getCategoryName(selectedCategory)}</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className="flex items-center justify-between"
                >
                  {category.label}
                  {selectedCategory === category.value && <Check className="w-4 h-4 ml-2" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
