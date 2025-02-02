import { VendorOnboardingForm } from "@/components/vendor/onboarding-form"

export default function VendorOnboarding() {
  return (
    <main className="container max-w-4xl py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Vendor Onboarding</h1>
        <p className="text-muted-foreground">Complete your vendor profile and start publishing AI models</p>
      </div>
      <VendorOnboardingForm />
    </main>
  )
}

