"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Github, Phone, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login" ? { phone, password } : { phone, password, name };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "操作失败");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHub = () => {
    window.location.href = "/api/github/authorize";
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-blue-500/50 focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-sm w-full"
      >
        {/* Back */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          返回
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "login" ? "登录" : "注册"} PRSchool
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {mode === "login"
              ? "继续你的学习之旅"
              : "开始从零到 Pull Request"}
          </p>
        </div>

        {/* GitHub Login */}
        <button
          onClick={handleGitHub}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[var(--color-border)] rounded-xl text-[var(--color-text)] font-medium hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-secondary)] transition-colors mb-4"
        >
          <Github size={18} />
          使用 GitHub 账号{mode === "login" ? "登录" : "注册"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-text-muted)]">或使用手机号</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        {/* Phone Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <div>
              <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">
                昵称
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="你的昵称"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">
              手机号
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                maxLength={11}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">
              密码
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !phone || !password}
            className="w-full py-3 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-30 mt-2"
          >
            {loading ? "请稍候..." : mode === "login" ? "登录" : "注册"}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6 text-sm text-[var(--color-text-muted)]">
          {mode === "login" ? (
            <>
              还没有账号？{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className="text-blue-400 hover:underline"
              >
                立即注册
              </button>
            </>
          ) : (
            <>
              已有账号？{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="text-blue-400 hover:underline"
              >
                去登录
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
