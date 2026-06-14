"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getOrganizations } from "@/features/organization/api/get-organizations";
import { CreateOrganization } from "@/features/organization/components/create-organization";
import { setActiveOrg } from "@/features/organization/model/active-org";

export default function OrganizationsPage() {
  const router = useRouter();

  const [orgs, setOrgs] = useState<any[]>([]);
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

  function handleSelect(orgId: string) {
    setActiveOrg(orgId);
    router.push(`/organizations/${orgId}`);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Organizations</h1>

        <CreateOrganization onSuccess={load} />
      </div>

      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : orgs.length === 0 ? (
        <p className="mt-4">No organizations yet</p>
      ) : (
        <div className="mt-4 space-y-2">
          {orgs.map((org) => (
            <div
              key={org.id}
              onClick={() => handleSelect(org.id)}
              className="border p-3 rounded cursor-pointer hover:bg-gray-50"
            >
              {org.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
