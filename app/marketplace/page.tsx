"use client";

import { useContext, useState } from "react";
import { ModelGrid } from "@/components/model-grid";
import { CategoryFilter } from "@/components/category-filter";
import { AuthContext } from "@/context/AuthContext";

export default function MarketplacePage() {
  const authContext = useContext(AuthContext);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    price: "all",
    search: "",
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleLogin = async () => {
    if (authContext && authContext.login) {
      await authContext.login();
    }
  };

  return (
    <>
      {showLoginPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-80 text-center">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Access Restricted
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in with DFINITY to access the marketplace.
            </p>
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium"
            >
              Login with DFINITY
            </button>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="container py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6 text-center homepage-highlight">
          AI Model Marketplace
        </h1>
        <p className="text-xl text-center mb-8 text-muted-foreground">
          Discover and deploy cutting-edge AI models on Neuralbay
        </p>
        <CategoryFilter onFilterChange={handleFilterChange} />
        <ModelGrid filters={filters} setShowLoginPrompt={setShowLoginPrompt} />
      </div>
    </>
  );
}
