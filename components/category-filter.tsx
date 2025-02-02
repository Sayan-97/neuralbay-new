"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function CategoryFilter({
  onFilterChange,
}: {
  onFilterChange: (filters: any) => void;
}) {
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState("all");
  const [search, setSearch] = useState("");

  const handleFilterChange = (filterType: string, value: string) => {
    let newFilters;
    switch (filterType) {
      case "category":
        setCategory(value);
        newFilters = { category: value, price, search };
        break;
      case "price":
        setPrice(value);
        newFilters = { category, price: value, search };
        break;
      case "search":
        setSearch(value);
        newFilters = { category, price, search: value };
        break;
      default:
        return;
    }
    onFilterChange(newFilters);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 glossy-card rounded-lg">
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <Select
          value={category}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-[180px] bg-card text-white border-accent">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="image">Image Generation</SelectItem>
            <SelectItem value="text">Text Processing</SelectItem>
            <SelectItem value="audio">Audio Processing</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={price}
          onValueChange={(value) => handleFilterChange("price", value)}
        >
          <SelectTrigger className="w-[180px] bg-card text-white border-accent">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search models..."
            className="pl-8 w-full sm:w-[300px] bg-card text-white border-accent"
            value={search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() =>
            onFilterChange({ category: "all", price: "all", search: "" })
          }
          className="border-accent text-accent hover:bg-accent hover:text-white"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
