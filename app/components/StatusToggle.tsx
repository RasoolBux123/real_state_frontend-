"use client";

import type { Property } from "../types";

type Props = {
  status: Property["status"];
  busy?: boolean;
  onChange: (next: Property["status"]) => void;
};

// ON = enabled (public), OFF = disabled (hidden). Pending counts as OFF.
export default function StatusToggle({ status, busy, onChange }: Props) {
  const on = status === "APPROVED";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={busy}
      onClick={() => onChange(on ? "REJECTED" : "APPROVED")}
      title={on ? "Enabled (click to disable)" : "Disabled (click to enable)"}
      className="flex items-center gap-2 disabled:opacity-50"
    >
      <span className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-green-500" : "bg-white/25"}`}>
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
        />
      </span>
      <span className={`w-14 text-left text-xs font-semibold ${on ? "text-green-300" : "text-white/60"}`}>
        {on ? "Enabled" : status === "PENDING" ? "Pending" : "Disabled"}
      </span>
    </button>
  );
}