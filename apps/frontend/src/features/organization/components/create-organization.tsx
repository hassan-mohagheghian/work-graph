"use client";

import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { CreateOrganizationSheet } from "./create-organization-sheet";

export function CreateOrganization() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Organization</Button>
      <CreateOrganizationSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
