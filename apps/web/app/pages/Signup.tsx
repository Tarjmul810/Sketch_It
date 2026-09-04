"use client";

import Link from "next/link";
import { AuthShell, AuthField } from "../../components/auth-shell";
import { useState } from "react";
import { BACKEND_URL } from "@repo/common/config";
import { setToken } from "../../lib/auth";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Full name is required.";
    if (!email) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 4) next.password = "Must be at least 4 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ general: data.message ?? "Could not create account. Please try again." });
        return;
      }
      if (data.token) setToken(data.token);
      window.location.href = "/dashboard";
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Start sketching"
      title={<>Open your first board today.</>}
      subtitle="Free for up to five collaborators. No credit card required."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-[oklch(0.58_0.20_28)] underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="name"
          label="Full name"
          placeholder="Mira Okafor"
          autoComplete="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
          }}
          error={errors.name}
        />
        <AuthField
          id="email"
          label="Email"
          type="email"
          placeholder="you@studio.com"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
          }}
          error={errors.email}
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          placeholder="At least 4 characters"
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
          }}
          error={errors.password}
          hint={
            !errors.password && password.length > 0 && password.length < 4
              ? "4+ characters required"
              : undefined
          }
        />

        {/* General / server error */}
        {errors.general && (
          <p className="text-[13px] text-[oklch(0.55_0.20_25)]" role="alert">
            {errors.general}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[oklch(0.58_0.20_28)] text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:opacity-80 disabled:opacity-60"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
              </svg>
              Creating account…
            </>
          ) : (
            <>
              Create account
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
