"use client";

import { useState } from "react";
import { createOrganization } from "../api/create-organization";

type Props = {
  onCreated?: () => void;
};

export function CreateOrganization({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!name.trim()) return;

    setLoading(true);

    try {
      await createOrganization({ name });

      setName("");
      setOpen(false);

      onCreated?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-2 border rounded"
      >
        + Create Organization
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-80">
            <h2 className="font-semibold mb-3">Create Organization</h2>

            <input
              className="border w-full p-2"
              placeholder="Organization name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setOpen(false);
                  setError("");
                }}
              >
                Cancel
              </button>

              <button onClick={handleCreate} disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
