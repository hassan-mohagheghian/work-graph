"use client";

import { useMembers } from "@/features/organization/hooks/use-members";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function MembersPage() {
  const params = useParams();
  const orgId = params.id as string;

  const { members, loading, changeRole, remove, invite } = useMembers(orgId);

  const [email, setEmail] = useState("");

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Invite */}
      <div className="flex gap-2">
        <input
          className="border px-3 py-2"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="px-3 py-2 border"
          onClick={() => {
            invite(email, "member");
            setEmail("");
          }}
        >
          Invite
        </button>
      </div>

      {/* Members list */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {members.map((m) => (
            <tr key={m.user_id} className="border-t">
              <td>{m.email}</td>

              <td>
                <select
                  value={m.role}
                  onChange={(e) => changeRole(m.user_id, e.target.value as any)}
                >
                  <option value="owner">owner</option>
                  <option value="admin">admin</option>
                  <option value="member">member</option>
                </select>
              </td>

              <td>
                <button
                  className="text-red-500"
                  onClick={() => remove(m.user_id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
