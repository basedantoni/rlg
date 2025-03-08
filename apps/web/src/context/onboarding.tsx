'use client';

import { NewDailyQuest } from '#db/schema/dailyQuests';
import { NewQuest } from '#db/schema/quests';
import { createContext, useContext, useState, ReactNode } from 'react';

type OnboardingContextType = {
  quests: Array<NewQuest>;
  updateQuests: (q: NewQuest) => void;
  dailyQuests: Array<NewDailyQuest>;
  updateDailyQuests: (d: NewDailyQuest) => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [quests, setQuests] = useState<Array<NewQuest>>([]);
  const [dailyQuests, setDailyQuests] = useState<Array<NewDailyQuest>>([]);

  const updateQuests = (q: NewQuest) => {
    setQuests([...quests, q]);
  };
  const updateDailyQuests = (d: NewDailyQuest) => {
    setDailyQuests([...dailyQuests, d]);
  };

  return (
    <OnboardingContext.Provider
      value={{ quests, updateQuests, dailyQuests, updateDailyQuests }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      'useOnboardingContext must be within an OnboardingProvider'
    );
  }
  return context;
}
