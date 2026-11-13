"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RegisterForm from "../../components/auth/RegisterForm";
import { getReturnTo } from "../../lib/redirect";

function Content() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect");
  const q = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";

  return (
    <RegisterForm
      onSuccess={() => router.push(getReturnTo(redirect))}
      onSwitch={() => router.push(`/login${q}`)}
    />
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}