"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginApi, getErrorMessage } from "../../lib/authApi";
import { authInput, authLabel, authError } from "../../lib/ui";
import { useAuthStore } from "../../store/authStore";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type FormData = z.infer<typeof schema>;

type Props = { onSuccess: () => void; onSwitch: () => void };

export default function LoginForm({ onSuccess, onSwitch }: Props) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormData) {
    setError("");
    try {
      const { user, token } = await loginApi(values.email, values.password);
      setAuth(user, token);
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-white">Welcome back</h1>
      <p className="mb-6 mt-1 text-sm text-white/70">
        Log in to message sellers and save properties.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className={authLabel}>Email</label>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={authInput}
            {...register("email")}
          />
          {errors.email && <p className={authError}>{errors.email.message}</p>}
        </div>

        <div>
          <label className={authLabel}>Password</label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            className={authInput}
            {...register("password")}
          />
          {errors.password && <p className={authError}>{errors.password.message}</p>}
        </div>

        {error && (
          <p className="rounded-xl border border-red-400/30 bg-red-500/15 p-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/70">
        New here?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-medium text-indigo-300 hover:underline"
        >
          Create an account
        </button>
      </p>
    </>
  );
}