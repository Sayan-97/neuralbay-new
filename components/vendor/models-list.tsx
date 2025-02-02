import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ModelsList() {
  return (
    <div className="bg-secondary/50 rounded-lg border">
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
          {models.map((model) => (
            <TableRow key={model.id}>
              <TableCell className="font-medium">{model.name}</TableCell>
              <TableCell>
                <Badge variant={model.status === "Live" ? "default" : "secondary"}>{model.status}</Badge>
              </TableCell>
              <TableCell>{model.category}</TableCell>
              <TableCell>{model.price}</TableCell>
              <TableCell>{model.apiCalls}</TableCell>
              <TableCell>${model.revenue}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" asChild>
                  <Link href={`/vendor/models/${model.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const models = [
  {
    id: 1,
    name: "Stable Diffusion v1",
    status: "Live",
    category: "Image Generation",
    price: "$0.03/call",
    apiCalls: "5,234",
    revenue: "12,350",
  },
  {
    id: 2,
    name: "Text Classifier Pro",
    status: "Draft",
    category: "Text Processing",
    price: "$0.01/call",
    apiCalls: "1,234",
    revenue: "2,350",
  },
  {
    id: 3,
    name: "Voice Recognition AI",
    status: "Live",
    category: "Audio Processing",
    price: "$0.05/call",
    apiCalls: "3,234",
    revenue: "8,350",
  },
]

