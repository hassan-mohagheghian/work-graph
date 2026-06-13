"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/shared/routes";
import {
  getOrganizations,
  Organization,
} from "@/features/organization/api/get-organizations";

export default function OrganizationsPage() {
  const router = useRouter();

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    async function load() {
      try {
        const data = await getOrganizations();
        setOrgs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading organizations...
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Organizations</h1>

        {orgs.length === 0 ? (
          <div className="text-gray-500">No organizations found</div>
        ) : (
          <div className="space-y-3">
            {orgs.map((org) => (
              <div key={org.id} className="p-4 border rounded-lg bg-white">
                {org.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
