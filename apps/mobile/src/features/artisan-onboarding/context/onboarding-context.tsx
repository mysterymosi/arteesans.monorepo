import type { Availability, GuarantorInput } from "@arteesans/shared";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type OnboardingDraft = {
  proofOfAddressUri: string | null;
  proofOfAddressFileName: string | null;
  yearsExperience: string;
  skillSlugs: string[];
  availability: Availability | "";
  bio: string;
  resumeUri: string | null;
  resumeFileName: string | null;
  facePhotoUri: string | null;
  firstGuarantor: GuarantorInput;
  secondGuarantor: GuarantorInput;
};

const emptyGuarantor = (): GuarantorInput => ({
  fullName: "",
  email: "",
  phone: "",
  address: "",
});

const initialDraft: OnboardingDraft = {
  proofOfAddressUri: null,
  proofOfAddressFileName: null,
  yearsExperience: "",
  skillSlugs: [],
  availability: "",
  bio: "",
  resumeUri: null,
  resumeFileName: null,
  facePhotoUri: null,
  firstGuarantor: emptyGuarantor(),
  secondGuarantor: emptyGuarantor(),
};

type OnboardingContextValue = {
  draft: OnboardingDraft;
  patchDraft: (patch: Partial<OnboardingDraft>) => void;
  resetDraft: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(initialDraft);

  const patchDraft = useCallback((patch: Partial<OnboardingDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(initialDraft);
  }, []);

  const value = useMemo(
    () => ({ draft, patchDraft, resetDraft }),
    [draft, patchDraft, resetDraft],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboardingDraft() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboardingDraft must be used within OnboardingProvider");
  }
  return context;
}
