"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Trash2, Edit, Eye, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

interface Model {
  id: string
  name: string
  vendor: string
  category: string
  status: string
  price: string
  createdAt: string
}

export function AdminModelsList() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/models")
      if (!response.ok) {
        throw new Error("Failed to fetch models")
      }
      const data = await response.json()
      setModels(data)
    } catch (error) {
      console.error("Error fetching models:", error)
      toast.error("Failed to load models")
    } finally {
      setLoading(false)
    }
  }

  const deleteModel = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/models/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete model")
      }

      setModels(models.filter((model) => model.id !== id))
      toast.success("Model deleted successfully")
    } catch (error) {
      console.error("Error deleting model:", error)
      toast.error("Failed to delete model")
    }
  }

  const approveModel = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/models/${id}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to approve model")
      }

      setModels(models.map((model) => (model.id === id ? { ...model, status: "Live" } : model)))
      toast.success("Model approved successfully")
    } catch (error) {
      console.error("Error approving model:", error)
      toast.error("Failed to approve model")
    }
  }

  const rejectModel = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/models/${id}/reject`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reject model")
      }

      setModels(models.map((model) => (model.id === id ? { ...model, status: "Rejected" } : model)))
      toast.success("Model rejected")
    } catch (error) {
      console.error("Error rejecting model:", error)
      toast.error("Failed to reject model")
    }
  }

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={fetchModels}>Refresh</Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No models found
                  </TableCell>
                </TableRow>
              ) : (
                filteredModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>{model.vendor}</TableCell>
                    <TableCell>{model.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          model.status === "Live"
                            ? "default"
                            : model.status === "Draft"
                              ? "outline"
                              : model.status === "Pending"
                                ? "secondary"
                                : "destructive"
                        }
                      >
                        {model.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{model.price}</TableCell>
                    <TableCell>{model.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => window.open(`/model/${model.id}`, "_blank")}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => (window.location.href = `/admin/models/${model.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {model.status === "Pending" && (
                            <>
                              <DropdownMenuItem onClick={() => approveModel(model.id)}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => rejectModel(model.id)}>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                Reject
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              if (
                                confirm("Are you sure you want to delete this model? This action cannot be undone.")
                              ) {
                                deleteModel(model.id)
                              }
                            }}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

