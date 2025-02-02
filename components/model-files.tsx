import { Folder, FileText, Clock } from "lucide-react"

export function ModelFiles() {
  return (
    <div className="rounded-lg border bg-secondary/50">
      <div className="flex items-center p-4 border-b">
        <Folder className="w-5 h-5 mr-2 text-primary" />
        <span className="font-medium">Main</span>
        <span className="ml-2 text-sm text-muted-foreground">Stable Diffusion v1-5</span>
        <div className="ml-auto flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-1" />
          About 2 Months ago
        </div>
      </div>
      <div className="divide-y">
        {files.map((file) => (
          <div key={file.name} className="flex items-center p-4">
            <FileText className="w-5 h-5 mr-2 text-muted-foreground" />
            <div>
              <div className="font-medium">{file.name}</div>
              <div className="text-sm text-muted-foreground">{file.description}</div>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">{file.date}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const files = [
  {
    name: "feature_extractor",
    description: "add diffusers weights",
    date: "8 months ago",
  },
  {
    name: "safety_checker",
    description: "add diffusers weights",
    date: "8 months ago",
  },
  {
    name: "scheduler",
    description: "add diffusers weights",
    date: "8 months ago",
  },
  {
    name: "text_encoder",
    description: "add diffusers weights",
    date: "8 months ago",
  },
  {
    name: "tokenizer",
    description: "add diffusers weights",
    date: "8 months ago",
  },
  {
    name: "unet",
    description: "add diffusers weights",
    date: "8 months ago",
  },
]

