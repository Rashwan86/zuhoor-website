"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }
      }

      router.push("/");
    } catch (error: any) {
      const msg =
        error?.message?.replace("Firebase: ", "") ??
        "Something went wrong. Try again.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  // Gold palette (metallic)
  const GOLD = {
    border: "border-[#D4AF37]/45",
    borderSoft: "border-[#D4AF37]/25",
    text: "text-[#FFD86A]",
    textSoft: "text-[#FFE9A6]",
    ring: "focus:ring-[#FFD700]/15",
    focusBorder: "focus:border-[#FFD700]/60",
    // Metallic gold gradient (bright + deep + highlight)
    grad: "bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0]",
    gradSoft:
      "bg-gradient-to-r from-[#6F5A00]/35 via-[#FFD700]/15 to-[#FFF4B0]/20",
    glow: "shadow-[0_0_60px_rgba(255,215,0,0.12)]",
    glowStrong: "shadow-[0_0_25px_rgba(255,215,0,0.35)]",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      {/* خلفية لمعان ذهب معدني */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -top-44 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-[#FFD700]/10 blur-3xl" />
        <div className="absolute top-1/2 left-10 -translate-y-1/2 h-[380px] w-[380px] rounded-full bg-[#FFF4B0]/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-[#8B7500]/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* بطاقة */}
        <div
          className={[
            "rounded-2xl border bg-black/70 backdrop-blur-xl",
            GOLD.border,
            GOLD.glow,
          ].join(" ")}
        >
          {/* هيدر */}
          <div className="px-6 pt-6">
            <h1
              className={[
                "text-center text-2xl font-semibold",
                "bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0]",
                "bg-clip-text text-transparent",
                "drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]",
              ].join(" ")}
            >
              {mode === "login" ? "Login" : "Create Account"}
            </h1>

            <p className="mt-2 text-center text-sm text-white/60">
              {mode === "login"
                ? "Welcome back. Please sign in."
                : "Create your account in seconds."}
            </p>
          </div>

          {/* تبويب */}
          <div className="mt-5 px-6">
            <div
              className={[
                "grid grid-cols-2 rounded-xl border bg-black/40 p-1",
                GOLD.borderSoft,
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => setMode("login")}
                className={[
                  "rounded-lg py-2 text-sm font-medium transition",
                  mode === "login"
                    ? [
                        GOLD.grad,
                        "text-black",
                        GOLD.glowStrong,
                        "hover:brightness-110",
                      ].join(" ")
                    : "text-white/70 hover:text-white",
                ].join(" ")}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => setMode("register")}
                className={[
                  "rounded-lg py-2 text-sm font-medium transition",
                  mode === "register"
                    ? [
                        GOLD.grad,
                        "text-black",
                        GOLD.glowStrong,
                        "hover:brightness-110",
                      ].join(" ")
                    : "text-white/70 hover:text-white",
                ].join(" ")}
              >
                Register
              </button>
            </div>
          </div>

          {/* فورم */}
          <form onSubmit={onSubmit} className="px-6 pb-6 pt-5 space-y-4">
            {mode === "register" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-white/70">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={[
                    "w-full rounded-xl border bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none",
                    GOLD.borderSoft,
                    GOLD.focusBorder,
                    "focus:ring-2",
                    GOLD.ring,
                  ].join(" ")}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={[
                  "w-full rounded-xl border bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none",
                  GOLD.borderSoft,
                  GOLD.focusBorder,
                  "focus:ring-2",
                  GOLD.ring,
                ].join(" ")}
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">
                Password
              </label>

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={[
                    "w-full rounded-xl border bg-black/30 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/35 outline-none",
                    GOLD.borderSoft,
                    GOLD.focusBorder,
                    "focus:ring-2",
                    GOLD.ring,
                  ].join(" ")}
                  placeholder="••••••••"
                  type={showPass ? "text" : "password"}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  required
                  minLength={6}
                />

                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className={[
                    "absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs font-medium transition",
                    mode === "login" ? GOLD.textSoft : GOLD.textSoft,
                    "hover:brightness-110",
                  ].join(" ")}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-2 text-[11px] text-white/40">
                Password must be at least 6 characters.
              </p>
            </div>

            {err && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={[
                "w-full rounded-xl px-4 py-3 text-sm font-semibold text-black transition",
                GOLD.grad,
                GOLD.glowStrong,
                "hover:brightness-110",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              ].join(" ")}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Login"
                  : "Create Account"}
            </button>

            <div className="text-center text-xs text-white/55">
              {mode === "login" ? (
                <>
                  No account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={[
                      "font-medium transition",
                      "bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0] bg-clip-text text-transparent",
                      "hover:brightness-110",
                    ].join(" ")}
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={[
                      "font-medium transition",
                      "bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0] bg-clip-text text-transparent",
                      "hover:brightness-110",
                    ].join(" ")}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* خط ذهبي سفلي */}
        <div
          className={[
            "mt-4 h-[2px] w-full rounded-full",
            "bg-gradient-to-r from-transparent via-[#FFD700]/70 to-transparent",
          ].join(" ")}
        />
      </div>
    </div>
  );
}
