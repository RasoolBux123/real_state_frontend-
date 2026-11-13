"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import PropertyForm, { type PropertyPayload } from "../../../components/PropertyForm";
import { createProperty } from "../../../lib/propertyApi";
import { useAuthModal } from "../../../store/authModalStore";
import { successChoice } from "../../../lib/popup";

export default function NewPropertyPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const openModal = useAuthModal((state) => state.openModal);
  const [submitted, setSubmitted] = useState(false);

  async function submitProperty(payload: PropertyPayload) {
    await createProperty(payload);
    if (user && token && user.role === "USER") setAuth({ ...user, role: "SELLER" }, token);
    setSubmitted(true);

    // popup: go to dashboard or add another property
    const goDashboard = await successChoice(
      "Property submitted!",
      "Our admin will review it. You will get a notification once it is approved and live.",
      "Go to dashboard",
      "Add another"
    );
    if (goDashboard) router.push("/dashboard");
    else setSubmitted(false);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Seller workspace</p>
        <h1 className="mt-2 text-3xl font-bold">Add a property</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Share your listing with buyers. New listings are saved as pending and appear publicly after admin approval.
        </p>
      </div>

      {!user || !token ? (
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold">Sign in to list your property</h2>
          <p className="mt-2 text-gray-600">You can use your existing account. Your first listing will activate seller access.</p>
          <button
            type="button"
            onClick={() => openModal("login", "/dashboard/properties/new")}
            className="mt-5 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
          >
            Login to continue
          </button>
        </div>
      ) : submitted ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8">
          <h2 className="text-xl font-semibold text-green-900">Property submitted for review</h2>
          <p className="mt-2 text-green-800">Your listing is saved. It will be visible to buyers after an admin approves it.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full bg-indigo-600 px-5 py-2.5 font-semibold text-white">Go to dashboard</Link>
            <button type="button" onClick={() => setSubmitted(false)} className="rounded-full border border-green-300 px-5 py-2.5 font-semibold text-green-900">Add another property</button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-8">
          <PropertyForm onSubmit={submitProperty} submitLabel="Submit for admin approval" />
        </div>
      )}
    </div>
  );
}