"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelSandbox } from "@/components/vendor/model-sandbox"
import { toast } from "sonner"

const modelFormSchema = z.object({
  name: z.string().min(2, {
    message: "Model name must be at least 2 characters.",
  }),
  version: z.string().min(1, {
    message: "Version is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  type: z.string({
    required_error: "Please select a pricing type.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  endpoint: z.string().url({
    message: "Please enter a valid endpoint URL.",
  }),
})

export function ModelPublishForm() {
  const form = useForm<z.infer<typeof modelFormSchema>>({
    resolver: zodResolver(modelFormSchema),
  })

  async function onSubmit(values: z.infer<typeof modelFormSchema>) {
    try {
      // Submit to your API here
      console.log(values)
      toast.success("Model published successfully!")
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <Tabs defaultValue="details" className="space-y-6">
      <TabsList className="bg-secondary/50">
        <TabsTrigger value="details">Model Details</TabsTrigger>
        <TabsTrigger value="files">Files & Documentation</TabsTrigger>
        <TabsTrigger value="sandbox">Test Sandbox</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 p-6 bg-secondary/50 rounded-lg border">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Stable Diffusion v1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input placeholder="1.0.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your model's capabilities..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="image">Image Generation</SelectItem>
                          <SelectItem value="text">Text Processing</SelectItem>
                          <SelectItem value="audio">Audio Processing</SelectItem>
                          <SelectItem value="video">Video Processing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="subscription">Per Call</SelectItem>
                          <SelectItem value="purchase">One-time Purchase</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="0.03" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Endpoint</FormLabel>
                      <FormControl>
                        <Input placeholder="https://api.example.com/v1/model" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" size="lg">
              Publish Model
            </Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="files">
        <div className="grid gap-6 p-6 bg-secondary/50 rounded-lg border">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Model Files</h3>
            <div className="grid gap-4">
              <FormItem>
                <FormLabel>Model Weights</FormLabel>
                <FormControl>
                  <Input type="file" />
                </FormControl>
                <FormDescription>Upload your model weights file (supported formats: .pt, .pth, .bin)</FormDescription>
              </FormItem>
              <FormItem>
                <FormLabel>Configuration File</FormLabel>
                <FormControl>
                  <Input type="file" />
                </FormControl>
                <FormDescription>
                  Upload your model configuration file (supported formats: .json, .yaml)
                </FormDescription>
              </FormItem>
              <FormItem>
                <FormLabel>Documentation</FormLabel>
                <FormControl>
                  <Input type="file" />
                </FormControl>
                <FormDescription>Upload documentation (supported formats: .md, .pdf)</FormDescription>
              </FormItem>
            </div>
          </div>
          <Button size="lg">Upload Files</Button>
        </div>
      </TabsContent>
      <TabsContent value="sandbox">
        <ModelSandbox />
      </TabsContent>
    </Tabs>
  )
}

