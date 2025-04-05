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
import { MoreHorizontal, Search, Trash2, Edit, UserCog, ShieldCheck, Ban } from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string;
  principalId: string;
}


// Helper function to include x-user-id in headers
const authFetch = async (url: string, options: RequestInit = {}) => {
  const principalId = localStorage.getItem("principalId") ?? "admin-1"
  const adminPass = localStorage.getItem("admin_pass") ?? ""

  return fetch(url, {
    ...options,
    headers: {
      "x-user-id": principalId,
      "x-admin-password": adminPass,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })
}



export function AdminUsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const BACKEND_URL = "http://localhost:3001";


  useEffect(() => {
    // Dev-mode: inject admin principalId into localStorage
    const existing = localStorage.getItem("principalId")
    if (!existing) {
      localStorage.setItem("principalId", "admin-1")
    }

    fetchUsers().then(() => {
      console.log("Loaded users:", users);
    });
  }, []);
  

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await authFetch(`${BACKEND_URL}/api/users`)
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: string, principalId?: string) => {
    try {
      const url = principalId
        ? `${BACKEND_URL}/api/users?principalId=${principalId}`
        : `${BACKEND_URL}/api/users/${id}`
  
      const response = await authFetch(url, { method: "DELETE" })
  
      if (!response.ok) {
        throw new Error("Failed to delete user")
      }
  
      setUsers(users.filter((user) => user.id !== id))
      toast.success("User deleted successfully")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    }
  }
  

  const banUser = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/${id}/ban`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to ban user")
      }

      setUsers(users.map((user) => (user.id === id ? { ...user, status: "Banned" } : user)))
      toast.success("User banned successfully")
    } catch (error) {
      console.error("Error banning user:", error)
      toast.error("Failed to ban user")
    }
  }

  const makeAdmin = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}/make-admin`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to update user role")
      }

      setUsers(users.map((user) => (user.id === id ? { ...user, role: "Admin" } : user)))
      toast.success("User promoted to admin")
    } catch (error) {
      console.error("Error updating user role:", error)
      toast.error("Failed to update user role")
    }
  }

  const filteredUsers = users.filter((user) =>
    user.principalId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={fetchUsers}>Refresh</Button>
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
                <TableHead>Role</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.principalId}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "Admin" ? "default" : user.role === "Vendor" ? "secondary" : "outline"}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
             
          
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
                          <DropdownMenuItem onClick={() => (window.location.href = `/admin/users/${user.id}`)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => (window.location.href = `/admin/users/${user.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.role !== "Admin" && (
                            <DropdownMenuItem onClick={() => makeAdmin(user.id)}>
                              <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                              Make Admin
                            </DropdownMenuItem>
                          )}
                          {user.status !== "Banned" && (
                            <DropdownMenuItem onClick={() => banUser(user.id)}>
                              <Ban className="mr-2 h-4 w-4 text-red-500" />
                              Ban User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
                                deleteUser(user.id, user.principalId)
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

