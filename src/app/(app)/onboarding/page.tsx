import { OnboardingProvider } from "@/context/onboarding";
import CategoryOnboard from "@/components/onboarding/category-onboard";

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <div className="h-screen flex flex-col justify-center items-center">
        <CategoryOnboard />
      </div>
    </OnboardingProvider>
  );
}
