"use client"

import { ModelGrid } from "@/components/model-grid"
import { CategoryFilter } from "@/components/category-filter"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function MarketplacePage() {
  const { principal, login } = useContext(AuthContext) || {}; // Use AuthContext
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: "all",
    price: "all",
    search: "",
  })

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  useEffect(() => {
    if (principal === null) {
      setLoading(false);
    }
  }, [principal]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!principal) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Login Required</h1>
        <p className="text-lg mb-6">You must log in with Internet Identity to access this page.</p>
        <button
          onClick={login}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg"
        >
          Login with Internet Identity
        </button>
      </div>
    );
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