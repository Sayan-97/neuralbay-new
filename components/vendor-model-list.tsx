"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface Model {
  id: string
  name: string
  status: string
  category: string
  price: string
  apiCalls: string
  revenue: string
}

export function VendorModelList() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const response = await fetch("/api/vendor/models")
      if (!response.ok) {
        throw new Error("Failed to fetch models")
      }
      const data = await response.json()
      setModels(data)
    } catch (error) {
      console.error("Error fetching models:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4">Your Models</h2>
      <div className="bg-card/50 rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>API Calls</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model, index) => (
              <motion.tr
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell>
                  <Badge variant={model.status === "Live" ? "default" : "secondary"}>{model.status}</Badge>
                </TableCell>
                <TableCell>{model.category}</TableCell>
                <TableCell>{model.price}</TableCell>
                <TableCell>{model.apiCalls}</TableCell>
                <TableCell>{model.revenue}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" asChild>
                    <Link href={`/vendor/models/${model.id}`}>Edit</Link>
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}

