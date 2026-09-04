"use client";

import Link from "next/link";
import { AuthShell, AuthField } from "../../components/auth-shell";
import { useState } from "react";
import { BACKEND_URL } from "@repo/common/config";
import { setToken } from "../../lib/auth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!email) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
    if (!password) return "Password is required.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Invalid credentials. Please try again.");
        return;
      }
      // Store token for WebSocket and API auth
      if (data.token) setToken(data.token);
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title={<>Pick up where you left off.</>}
      subtitle="Sign in to your boards and the people drawing on them."
      footer={
        <>
          New to Sketcha?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-[oklch(0.58_0.20_28)] underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="email"
          label="Email"
          type="email"
          placeholder="you@studio.com"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          error={error && !email ? error : undefined}
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError(null);
          }}
          error={error && email && !password ? error : undefined}
        />

        {/* Inline server error */}
        {error && email && password && (
          <p className="text-[13px] text-[oklch(0.55_0.20_25)]" role="alert">
            {error}
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
              Signing in…
            </>
          ) : (
            <>
              Sign in
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
