"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type AIModel, ModelType } from "@/types/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Loader2, Sparkles } from "lucide-react";

// Mock data - replace with your actual API call
const mockModel: AIModel = {
  id: "gpt-4o",
  name: "GPT-4o",
  description: "Advanced text generation model with reasoning capabilities",
  type: ModelType.TEXT,
  provider: "OpenAI",
  version: "1.0",
  inputParams: [
    { name: "prompt", type: "string", required: true },
    { name: "temperature", type: "number", min: 0, max: 2, default: 0.7 },
    { name: "max_tokens", type: "number", min: 1, max: 4096, default: 1024 },
  ],
  pricing: { cost: 0.01, unit: "1K tokens" },
  performanceMetrics: { latency: "~1s", accuracy: 0.92 },
};
// Form schema for text models
const textModelSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().min(1).max(4096).optional(),
});

// Form schema for image models
const imageModelSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  negative_prompt: z.string().optional(),
  steps: z.number().min(10).max(150).optional(),
  guidance_scale: z.number().min(1).max(20).optional(),
});

export default function SandboxPage() {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(mockModel);
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("input");

  // Initialize form based on model type
  const form = useForm({
    resolver: zodResolver(
      selectedModel?.type === ModelType.IMAGE
        ? imageModelSchema
        : textModelSchema
    ),
    defaultValues: {
      prompt: "",
      temperature: 0.7,
      max_tokens: 1024,
      negative_prompt: "",
      steps: 50,
      guidance_scale: 7.5,
    },
  });

  const onSubmit = async (data: any) => {
    if (!selectedModel) return;

    setIsLoading(true);
    setActiveTab("output");

    try {
      // Simulate API call to the model
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response based on model type
      if (selectedModel.type === ModelType.TEXT) {
        setOutput(
          `This is a simulated response from ${selectedModel.name} based on your prompt: "${data.prompt}"\n\nThe model would process this with temperature: ${data.temperature} and max tokens: ${data.max_tokens}.\n\nIn a real implementation, this would connect to the actual model API and return the genuine model output.`
        );
      } else if (selectedModel.type === ModelType.IMAGE) {
        setOutput(
          `[Image Generation Simulation]\n\nModel: ${
            selectedModel.name
          }\nPrompt: "${data.prompt}"\nNegative Prompt: "${
            data.negative_prompt || "None"
          }"\nSteps: ${data.steps}\nGuidance Scale: ${
            data.guidance_scale
          }\n\nIn a real implementation, this would display the generated image.`
        );
      }
    } catch (error) {
      setOutput(`Error: Failed to get response from the model. ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelSelect = (modelId: string) => {
    const model = mockModel;
    if (model) {
      setSelectedModel(model);

      // Reset form with default values from the selected model
      const defaults: any = { prompt: "" };
      model.inputParams.forEach((param) => {
        if (param.default !== undefined) {
          defaults[param.name] = param.default;
        }
      });

      form.reset(defaults);
      setOutput(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Model Sandbox</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Model Selection */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Selected Model</CardTitle>
            <CardDescription>Choose an AI model to test</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              key={mockModel.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedModel?.id === mockModel.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleModelSelect(mockModel.id)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{mockModel.name}</h3>
                <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                  {mockModel.type}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {mockModel.description}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                <span>Provider: {mockModel.provider}</span>
                <span className="mx-2">•</span>
                <span>Version: {mockModel.version}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sandbox Area */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedModel
                ? `Testing ${selectedModel.name}`
                : "Select a model to begin"}
            </CardTitle>
            <CardDescription>
              {selectedModel
                ? `Configure parameters and test the ${selectedModel.type.toLowerCase()} model`
                : "Choose a model from the list on the left"}
            </CardDescription>
          </CardHeader>

          {selectedModel && (
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="input">Input</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                </TabsList>

                <TabsContent value="input">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* Common field for all models */}
                      <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prompt</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your prompt here..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Describe what you want the model to generate
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Text model specific fields */}
                      {selectedModel.type === ModelType.TEXT && (
                        <>
                          <FormField
                            control={form.control}
                            name="temperature"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Temperature: {field.value}
                                </FormLabel>
                                <FormControl>
                                  <Slider
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    value={[field.value]}
                                    onValueChange={(value) =>
                                      field.onChange(value[0])
                                    }
                                  />
                                </FormControl>
                                <FormDescription>
                                  Controls randomness: lower values are more
                                  deterministic, higher values more creative
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="max_tokens"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Max Tokens: {field.value}</FormLabel>
                                <FormControl>
                                  <Slider
                                    min={1}
                                    max={4096}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(value) =>
                                      field.onChange(value[0])
                                    }
                                  />
                                </FormControl>
                                <FormDescription>
                                  Maximum number of tokens to generate
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {/* Image model specific fields */}
                      {selectedModel.type === ModelType.IMAGE && (
                        <>
                          <FormField
                            control={form.control}
                            name="negative_prompt"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Negative Prompt</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Things to exclude from the generation..."
                                    className="min-h-[80px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Describe what you want the model to avoid
                                  (optional)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="steps"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Steps: {field.value}</FormLabel>
                                <FormControl>
                                  <Slider
                                    min={10}
                                    max={150}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(value) =>
                                      field.onChange(value[0])
                                    }
                                  />
                                </FormControl>
                                <FormDescription>
                                  Number of denoising steps (higher = more
                                  detail but slower)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="guidance_scale"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Guidance Scale: {field.value}
                                </FormLabel>
                                <FormControl>
                                  <Slider
                                    min={1}
                                    max={20}
                                    step={0.5}
                                    value={[field.value]}
                                    onValueChange={(value) =>
                                      field.onChange(value[0])
                                    }
                                  />
                                </FormControl>
                                <FormDescription>
                                  How closely to follow the prompt (higher =
                                  more faithful)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Run Model
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="output">
                  <Card className="border bg-muted/40">
                    <CardContent className="p-4">
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                          <p className="text-muted-foreground">
                            Processing your request...
                          </p>
                        </div>
                      ) : output ? (
                        <div className="whitespace-pre-wrap font-mono text-sm">
                          {output}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <p>Run the model to see output here</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          )}

          {!selectedModel && (
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p>👈 Select a model from the list to get started</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
