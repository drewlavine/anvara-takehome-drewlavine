'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type FormContextType = {
  adSlotFormSuccess: boolean;
  campaignFormSuccess: boolean;
  setAdSlotFormSuccess: (success: boolean) => void;
  setCampaignFormSuccess: (success: boolean) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [adSlotFormSuccess, setAdSlotFormSuccess] = useState(false);
  const [campaignFormSuccess, setCampaignFormSuccess] = useState(false);

  return (
    <FormContext.Provider
      value={{
        adSlotFormSuccess,
        campaignFormSuccess,
        setAdSlotFormSuccess,
        setCampaignFormSuccess,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}
