"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "../../components/auth/LoginForm";
import { getReturnTo } from "../../lib/redirect";

function Content() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect");
  const q = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";

  return (
    <LoginForm
      onSuccess={() => router.push(getReturnTo(redirect))}
      onSwitch={() => router.push(`/register${q}`)}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}