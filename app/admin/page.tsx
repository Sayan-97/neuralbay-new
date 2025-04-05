"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminModelsList } from "@/components/admin/models-list"
import { AdminUsersList } from "@/components/admin/users-list"
import { AdminTransactionsList } from "@/components/admin/transactions-list"
import { Button } from "@/components/ui/button"
import { BarChart, Users, ShoppingBag, CreditCard, AlertTriangle, Activity, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"

interface AdminStats {
  totalUsers: number
  totalVendors: number
  totalModels: number
  totalRevenue: number
  activeUsers: number
  pendingApprovals: number
  growthRate: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)

  const BACKEND_URL = "http://localhost:3001"

  const handlePasswordSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats`, {
        headers: { "x-admin-password": password },
      })

      if (!response.ok) throw new Error("Invalid password or unauthorized")

      localStorage.setItem("admin_pass", password)
      setAuthenticated(true)
    } catch (error: any) {
      toast.error(error.message || "Unauthorized")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem("admin_pass")
    if (!stored) return

    const fetchStats = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/stats`, {
          headers: { "x-admin-password": stored },
        })

        if (!response.ok) throw new Error("Unauthorized")

        const data = await response.json()
        setStats(data)
        setAuthenticated(true)
      } catch (err) {
        console.error(err)
        toast.error("Authentication failed")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // ✅ Always render same number of hooks, wrap UI conditionally
  if (!authenticated) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <h2 className="text-2xl font-semibold">Enter Admin Password</h2>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin Password"
          className="w-[300px]"
        />
        <Button onClick={handlePasswordSubmit} disabled={loading}>
          {loading ? "Authenticating..." : "Access Dashboard"}
        </Button>
      </div>
    )
  }


  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent"
        >
          Admin Master Dashboard
        </motion.h1>
        <Button variant="destructive" className="bg-secondary hover:bg-secondary/90">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Emergency Shutdown
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card className="glossy-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-8 bg-muted rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{stats?.totalUsers}</div>
            )}
          </CardContent>
        </Card>
        <Card className="glossy-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-8 bg-muted rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{stats?.totalVendors}</div>
            )}
          </CardContent>
        </Card>
        <Card className="glossy-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-8 bg-muted rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{stats?.totalModels}</div>
            )}
          </CardContent>
        </Card>
        <Card className="glossy-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-8 bg-muted rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{stats?.totalRevenue} ICP</div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="glossy-card">
          <CardHeader>
            <CardTitle>Platform Management</CardTitle>
            <CardDescription>Manage all aspects of the ICP AI Marketplace platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="models">Models</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.activeUsers}</div>
                      <p className="text-xs text-muted-foreground">Currently online</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.pendingApprovals}</div>
                      <p className="text-xs text-muted-foreground">Models awaiting review</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center">
                        {stats?.growthRate}%
                        <TrendingUp className="ml-2 h-4 w-4 text-accent" />
                      </div>
                      <p className="text-xs text-muted-foreground">Month over month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-accent">Excellent</div>
                      <p className="text-xs text-muted-foreground">All systems operational</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex space-x-4">
                  <Button className="flex-1">
                    <CreditCard className="mr-2 h-4 w-4" />
                    View Financial Reports
                  </Button>
                  <Button variant="outline" className="flex-1">
                    System Logs
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="models">
                <AdminModelsList />
              </TabsContent>

              <TabsContent value="users">
                <AdminUsersList />
              </TabsContent>

              <TabsContent value="transactions">
                <AdminTransactionsList />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

