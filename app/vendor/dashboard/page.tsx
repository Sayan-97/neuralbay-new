"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VendorModelList } from "@/components/vendor-model-list"
import Link from "next/link"
import { BarChart, Users, Activity } from "lucide-react"
import { motion } from "framer-motion"

interface VendorStats {
  totalRevenue: number
  activeUsers: number
  apiCalls: number
  revenueChange: number
  userChange: number
  apiCallsChange: number
}

export default function VendorDashboard() {
  const [stats, setStats] = useState<VendorStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/vendor/dashboard-stats")
        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="container py-8 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold"
        >
          Vendor Dashboard
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button asChild>
            <Link href="/vendor/models/new">Publish New Model</Link>
          </Button>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="grid gap-6 md:grid-cols-3 mb-8"
      >
        <Card className="glossy-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-8 bg-muted rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalRevenue} ICP</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.revenueChange > 0 ? "+" : ""}
                  {stats?.revenueChange}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="glossy-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-8 bg-muted rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">+{stats?.activeUsers}</div>
                <p className="text-xs text-muted-foreground">+{stats?.userChange} since last hour</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="glossy-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-8 bg-muted rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.apiCalls}</div>
                <p className="text-xs text-muted-foreground">+{stats?.apiCallsChange}% from last month</p>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <VendorModelList />
    </div>
  )
}

