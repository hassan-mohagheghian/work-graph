"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  JSX,
} from "react";

type OrgContextType = {
  orgId: string | null;
  setOrgId: (id: string | null) => void;
};

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [orgId, setOrgId] = useState<string | null>(null);

  return (
    <OrgContext.Provider value={{ orgId, setOrgId }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg(): OrgContextType {
  const ctx = useContext(OrgContext);

  if (!ctx) {
    throw new Error("useOrg must be used inside OrgProvider");
  }

  return ctx;
}
