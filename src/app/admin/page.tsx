"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CreditCard,
  GraduationCap,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  paidUsers: number;
  completedUsers: number;
  refundedUsers: number;
  revenue: number;
  completionRate: number;
}

interface UserRow {
  id: string;
  name: string;
  phone: string;
  githubLogin: string | null;
  createdAt: string;
  completedLevels: number;
  paid: boolean;
  graduated: boolean;
  refunded: boolean;
}

const STAT_CARDS = [
  { icon: Users, label: "总用户", key: "totalUsers" as const, color: "#3b82f6" },
  { icon: CreditCard, label: "已付费", key: "paidUsers" as const, color: "#10b981" },
  { icon: GraduationCap, label: "已毕业", key: "completedUsers" as const, color: "#8b5cf6" },
  { icon: TrendingUp, label: "净收入", key: "revenue" as const, color: "#f59e0b" },
];

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setUsers(data.users);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatValue = (key: string): string | number => {
    if (!stats) return "-";
    if (key === "revenue") {
      return `¥${((stats.revenue - stats.refundedUsers * 990) / 100).toFixed(2)}`;
    }
    return stats[key as keyof Stats] ?? "-";
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight">管理后台</h1>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)] transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            刷新
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {STAT_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]"
            >
              <card.icon className="w-5 h-5 mb-2" style={{ color: card.color }} />
              <div className="text-2xl font-bold tabular-nums">
                {getStatValue(card.key)}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">{card.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Funnel */}
        {stats && (
          <div className="mb-8 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <h3 className="text-sm font-semibold mb-4">转化漏斗</h3>
            <div className="space-y-2.5">
              {[
                { label: "注册", value: stats.totalUsers, pct: 100, color: "#3b82f6" },
                {
                  label: "付费",
                  value: stats.paidUsers,
                  pct: stats.totalUsers
                    ? Math.round((stats.paidUsers / stats.totalUsers) * 100)
                    : 0,
                  color: "#10b981",
                },
                {
                  label: "毕业",
                  value: stats.completedUsers,
                  pct: stats.paidUsers
                    ? Math.round((stats.completedUsers / stats.paidUsers) * 100)
                    : 0,
                  color: "#8b5cf6",
                },
                {
                  label: "返现",
                  value: stats.refundedUsers,
                  pct: stats.completedUsers
                    ? Math.round(
                        (stats.refundedUsers / stats.completedUsers) * 100,
                      )
                    : 0,
                  color: "#f59e0b",
                },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--color-text-muted)] w-10">
                    {step.label}
                  </span>
                  <div className="flex-1 h-5 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: step.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${step.pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs text-[var(--color-text-secondary)] w-20 text-right font-mono tabular-nums">
                    {step.value} ({step.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-semibold">用户列表</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {["用户", "手机", "GitHub", "进度", "状态"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-[var(--color-text-muted)]"
                    >
                      {loading ? "加载中..." : "暂无用户"}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">
                        {u.phone || "-"}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)]">
                        {u.githubLogin || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden max-w-[80px]">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(u.completedLevels / 20) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-[var(--color-text-muted)] tabular-nums">
                            {u.completedLevels}/20
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {u.refunded ? (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs">
                            已返现
                          </span>
                        ) : u.graduated ? (
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs">
                            已毕业
                          </span>
                        ) : u.paid ? (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs">
                            已付费
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] rounded-full text-xs">
                            免费
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
