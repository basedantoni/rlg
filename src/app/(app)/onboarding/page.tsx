import { OnboardingProvider } from "@/context/onboarding";
import Review from "@/components/onboarding/review";
import SetupForm from "@/components/onboarding/setup-form";

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <div className="h-screen grid grid-cols-2 grid-rows-[1fr_12fr] gap-0">
        <div className="border-r border-b border-1">back</div>
        <div className="border-b border-1">RLG</div>
        <div className="flex flex-col gap-11 px-20 py-24 border-r border-1">
          <div className="flex flex-col gap-2.5">
            <p className="text-2xl font-semibold">Welcome to RLG</p>
            <p className="text-sm">
              RLG is your life goals gamified. We help you become the hero in
              your own life.
            </p>
          </div>
          <SetupForm />
        </div>
        <div className="flex flex-col px-20 py-16">
          <Review />
        </div>
      </div>
    </OnboardingProvider>
  );
}
