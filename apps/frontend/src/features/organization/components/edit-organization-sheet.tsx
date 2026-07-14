"use client";

import { useEffect, useState } from "react";

import { useUpdateOrganization } from "../hooks/use-update-organization";
import type { Organization } from "../api/get-organizations";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/shared/ui/sheet";

interface EditOrganizationSheetProps {
  organization: Organization | null | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditOrganizationSheet({
  organization,
  open,
  onOpenChange,
}: EditOrganizationSheetProps) {
  const orgId = organization?.id ?? "";
  const updateOrganization = useUpdateOrganization(orgId);

  const [name, setName] = useState("");

  useEffect(() => {
    if (organization && open) {
      setName(organization.name);
    }
  }, [organization, open]);

  function handleSave() {
    if (!organization || !name.trim()) return;

    updateOrganization.mutate(
      { name },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[60vh]">
        <SheetHeader>
          <SheetTitle>Edit Organization</SheetTitle>
          <SheetDescription>
            Update the organization name.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name-edit">Name</Label>
            <Input
              id="org-name-edit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!name.trim() || updateOrganization.isPending}
          >
            {updateOrganization.isPending ? "Saving..." : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
