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
import { MoreHorizontal, Search, Trash2, CheckCircle, XCircle, Building, BarChart } from "lucide-react"
import { toast } from "sonner"

interface Vendor {
  id: string
  name: string
  email: string
  status: string
  models: number
  revenue: string
  joinedAt: string
}

export function AdminVendorsList() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const BACKEND_URL = "http://localhost:3001";


  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/vendors`)
      if (!response.ok) {
        throw new Error("Failed to fetch vendors")
      }
      const data = await response.json()
      setVendors(data)
    } catch (error) {
      console.error("Error fetching vendors:", error)
      toast.error("Failed to load vendors")
    } finally {
      setLoading(false)
    }
  }

  const deleteVendor = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/vendors/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete vendor")
      }

      setVendors(vendors.filter((vendor) => vendor.id !== id))
      toast.success("Vendor deleted successfully")
    } catch (error) {
      console.error("Error deleting vendor:", error)
      toast.error("Failed to delete vendor")
    }
  }

  const approveVendor = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/vendors/${id}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to approve vendor")
      }

      setVendors(vendors.map((vendor) => (vendor.id === id ? { ...vendor, status: "Approved" } : vendor)))
      toast.success("Vendor approved successfully")
    } catch (error) {
      console.error("Error approving vendor:", error)
      toast.error("Failed to approve vendor")
    }
  }

  const rejectVendor = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/vendors/${id}/reject`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reject vendor")
      }

      setVendors(vendors.map((vendor) => (vendor.id === id ? { ...vendor, status: "Rejected" } : vendor)))
      toast.success("Vendor rejected")
    } catch (error) {
      console.error("Error rejecting vendor:", error)
      toast.error("Failed to reject vendor")
    }
  }

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={fetchVendors}>Refresh</Button>
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
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Models</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No vendors found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          vendor.status === "Approved"
                            ? "default"
                            : vendor.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{vendor.models}</TableCell>
                    <TableCell>{vendor.revenue}</TableCell>
                    <TableCell>{vendor.joinedAt}</TableCell>
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
                          <DropdownMenuItem onClick={() => (window.location.href = `/admin/vendors/${vendor.id}`)}>
                            <Building className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => (window.location.href = `/admin/vendors/${vendor.id}/models`)}
                          >
                            <BarChart className="mr-2 h-4 w-4" />
                            View Models
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {vendor.status === "Pending" && (
                            <>
                              <DropdownMenuItem onClick={() => approveVendor(vendor.id)}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => rejectVendor(vendor.id)}>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                Reject
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              if (
                                confirm("Are you sure you want to delete this vendor? This action cannot be undone.")
                              ) {
                                deleteVendor(vendor.id)
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

