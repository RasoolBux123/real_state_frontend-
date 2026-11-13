"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerApi, getErrorMessage } from "../../lib/authApi";
import { authInput, authLabel, authError } from "../../lib/ui";
import { useAuthStore } from "../../store/authStore";

const schema = z
  .object({
    name: z.string().min(2, "Enter your name"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().trim().min(10, "Enter a valid phone number").max(20, "Phone number is too long"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type FormData = z.infer<typeof schema>;

type Props = { onSuccess: () => void; onSwitch: () => void };

export default function RegisterForm({ onSuccess, onSwitch }: Props) {
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
      // role nahi jata: backend har naye account ko USER banata hai
      const { confirmPassword, ...rest } = values;
      void confirmPassword;
      const { user, token } = await registerApi(rest);
      setAuth(user, token);
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-white">Create your account</h1>
      <p className="mb-6 mt-1 text-sm text-white/70">
        Browse properties, contact sellers, or list your own property.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className={authLabel}>Full name</label>
          <input autoComplete="name" className={authInput} {...register("name")} />
          {errors.name && <p className={authError}>{errors.name.message}</p>}
        </div>

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
          <label className={authLabel}>Phone</label>
          <input
            autoComplete="tel"
            placeholder="03XX XXXXXXX"
            required
            className={authInput}
            {...register("phone")}
          />
          {errors.phone && <p className={authError}>{errors.phone.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={authLabel}>Password</label>
            <input
              type="password"
              autoComplete="new-password"
              className={authInput}
              {...register("password")}
            />
            {errors.password && <p className={authError}>{errors.password.message}</p>}
          </div>
          <div>
            <label className={authLabel}>Confirm password</label>
            <input
              type="password"
              autoComplete="new-password"
              className={authInput}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className={authError}>{errors.confirmPassword.message}</p>
            )}
          </div>
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/70">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-medium text-indigo-300 hover:underline"
        >
          Log in
        </button>
      </p>
    </>
  );
}
