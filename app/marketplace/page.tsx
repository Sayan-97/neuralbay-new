"use client"

import { useState } from "react"
import { ModelGrid } from "@/components/model-grid"
import { CategoryFilter } from "@/components/category-filter"

export default function MarketplacePage() {
  const [filters, setFilters] = useState({
    category: "all",
    price: "all",
    search: "",
  })

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="container py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-center homepage-highlight">
        AI Model Marketplace
      </h1>
      <p className="text-xl text-center mb-8 text-muted-foreground">
        Discover and deploy cutting-edge AI models on Neuralbay
      </p>
      <CategoryFilter onFilterChange={handleFilterChange} />
      <ModelGrid filters={filters} />
    </div>
  )
}

