"use client";

import { useEffect, useState } from "react";

import {
  getOrganizations,
  Organization,
} from "@/features/organization/api/get-organizations";
import { CreateOrganization } from "@/features/organization/components/create-organization";

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await getOrganizations();
      setOrgs(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Organizations</h1>

        <CreateOrganization onCreated={load} />
      </div>

      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : orgs.length === 0 ? (
        <p className="mt-4">No organizations yet</p>
      ) : (
        <div className="mt-4 space-y-2">
          {orgs.map((org) => (
            <div key={org.id} className="border p-3 rounded">
              {org.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
