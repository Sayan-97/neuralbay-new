"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function ModelApiTest() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const handleTest = async () => {
    // In a real application, this would make an API call to the model
    setOutput("Processing...")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setOutput(`Model output for input: ${input}`)
    toast.success("API test completed successfully!")
  }

  return (
    <div className="space-y-4">
      <Textarea placeholder="Enter your test input here..." value={input} onChange={(e) => setInput(e.target.value)} />
      <Button onClick={handleTest}>Test API</Button>
      {output && (
        <div className="p-4 bg-muted rounded-md">
          <h3 className="font-semibold mb-2">Output:</h3>
          <p>{output}</p>
        </div>
      )}
    </div>
  )
}

