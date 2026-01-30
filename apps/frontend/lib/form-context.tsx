'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type FormContextType = {
  adSlotFormSuccess: boolean;
  campaignFormSuccess: boolean;
  campaignDeleteSuccess: boolean;
  adSlotDeleteSuccess: boolean;
  setAdSlotFormSuccess: (success: boolean) => void;
  setCampaignFormSuccess: (success: boolean) => void;
  setCampaignDeleteSuccess: (success: boolean) => void;
  setAdSlotDeleteSuccess: (success: boolean) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [adSlotFormSuccess, setAdSlotFormSuccess] = useState(false);
  const [campaignFormSuccess, setCampaignFormSuccess] = useState(false);
  const [campaignDeleteSuccess, setCampaignDeleteSuccess] = useState(false);
  const [adSlotDeleteSuccess, setAdSlotDeleteSuccess] = useState(false);

  return (
    <FormContext.Provider
      value={{
        adSlotFormSuccess,
        campaignFormSuccess,
        campaignDeleteSuccess,
        adSlotDeleteSuccess,
        setAdSlotFormSuccess,
        setCampaignFormSuccess,
        setCampaignDeleteSuccess,
        setAdSlotDeleteSuccess,
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
