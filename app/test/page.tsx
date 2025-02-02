"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip } from "lucide-react"
import { useState } from "react"

export default function TestPage() {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle prompt submission
    console.log("Submitting prompt:", prompt)
  }

  return (
    <main className="container max-w-4xl py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Test Run</h1>
        <p className="text-muted-foreground">Try out the model with your own prompt</p>
      </div>
      <div className="rounded-lg border bg-secondary/50 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Enter prompt"
              className="min-h-[200px] bg-background/50"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button type="submit">Send</Button>
          </div>
        </form>
      </div>
    </main>
  )
}

