// Model types enum
export enum ModelType {
  TEXT = "Text",
  IMAGE = "Image",
  AUDIO = "Audio",
  VIDEO = "Video",
  MULTIMODAL = "Multimodal",
}

// Parameter type for model inputs
export interface ModelParameter {
  name: string;
  type: "string" | "number" | "boolean" | "array";
  required?: boolean;
  default?: any;
  min?: number;
  max?: number;
  options?: string[];
  description?: string;
}

// Pricing information
export interface ModelPricing {
  cost: number;
  unit: string;
  currency?: string;
  tiered?: boolean;
}

// Performance metrics
export interface PerformanceMetrics {
  latency?: string;
  accuracy?: number;
  quality?: number;
  customMetrics?: Record<string, any>;
}

// Main AI Model schema
export interface AIModel {
  id: string;
  name: string;
  description: string;
  type: ModelType;
  provider: string;
  version: string;
  inputParams: ModelParameter[];
  outputFormat?: string;
  pricing: ModelPricing;
  performanceMetrics: PerformanceMetrics;
  tags?: string[];
  documentation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Model response interface
export interface ModelResponse {
  modelId: string;
  input: Record<string, any>;
  output: any;
  processingTime: number;
  tokenUsage?: {
    input: number;
    output: number;
    total: number;
  };
  cost?: number;
  timestamp: Date;
}
