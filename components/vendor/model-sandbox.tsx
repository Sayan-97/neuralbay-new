"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export function ModelSandbox() {
  const [input, setInput] = useState("")
  const [method, setMethod] = useState("POST")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState("")

  async function testEndpoint() {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setResponse(
        JSON.stringify(
          {
            status: "success",
            result: "Model response for input: " + input,
          },
          null,
          2,
        ),
      )
      toast.success("Test completed successfully!")
    } catch (error) {
      toast.error("Test failed. Please check your endpoint configuration.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 p-6 bg-secondary/50 rounded-lg border">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Test Configuration</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Method</label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Headers</label>
              <Input
                placeholder='{"Content-Type": "application/json"}'
                defaultValue='{"Content-Type": "application/json"}'
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Request Body</label>
              <Textarea
                placeholder="Enter request payload..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>
        <Button onClick={testEndpoint} disabled={loading} size="lg">
          {loading ? "Testing..." : "Test Endpoint"}
        </Button>
      </div>
      {response && (
        <div className="grid gap-4 p-6 bg-secondary/50 rounded-lg border">
          <h3 className="text-lg font-semibold">Response</h3>
          <pre className="bg-secondary p-4 rounded-lg overflow-auto">{response}</pre>
        </div>
      )}
    </div>
  )
}

