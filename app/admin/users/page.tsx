"use client";

import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { deleteAdminUser, getAdminUsers } from "../../lib/adminApi";
import { formatDate } from "../../lib/format";
import { useAuthStore } from "../../store/authStore";
import { AdminUser, Role } from "../../types";

const roleStyle: Record<Role, string> = {
  ADMIN: "bg-purple-500/20 text-purple-200",
  SELLER: "bg-indigo-500/20 text-indigo-200",
  USER: "bg-white/10 text-white/70",
};

export default function AdminUsers() {
  const me = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .catch(() => setError("Could not load users"))
      .finally(() => setLoading(false));
  }, []);

  const q = query.trim().toLowerCase();
  const rows = users.filter(
    (u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );

  async function remove(u: AdminUser) {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    setBusy(u.id);
    try {
      await deleteAdminUser(u.id);
      setUsers((list) => list.filter((x) => x.id !== u.id));
    } catch {
      alert("Could not delete user, please try again");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="relative w-full sm:w-80">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or email"
          className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-white/40 focus:border-indigo-400"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900">
        {loading ? (
          <p className="p-10 text-center text-sm text-white/60">Loading...</p>
        ) : error ? (
          <p className="p-10 text-center text-sm text-red-300">{error}</p>
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-white/50">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase text-white/50">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {rows.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/30 font-semibold">
                          {u.name[0]?.toUpperCase()}
                        </span>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-white/50">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-white/70">{u.phone || "-"}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${roleStyle[u.role]}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/60">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end">
                        {u.role !== "ADMIN" && u.id !== me?.id && (
                          <button
                            title="Delete user"
                            disabled={busy === u.id}
                            onClick={() => remove(u)}
                            className="rounded-lg border border-white/15 p-2 text-red-300 transition hover:bg-red-500/10 disabled:opacity-40"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}