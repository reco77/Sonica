"use client";

import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Plus,
  Download,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getStats, getOrders } from "../lib/api";
import type { DashboardStats, ApiOrder } from "../lib/api";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400",
  CONFIRMED: "bg-blue-500/10 text-blue-400",
  SHIPPED: "bg-violet-500/10 text-violet-400",
  DELIVERED: "bg-emerald-500/10 text-emerald-400",
  CANCELLED: "bg-red-500/10 text-red-400",
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  shipped: "bg-violet-500/10 text-violet-400",
  delivered: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-red-500/10 text-red-400",
};

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: getStats,
  });

  const {
    data: ordersRes,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: () => getOrders({ limit: 10 }),
  });

  const recentOrders: ApiOrder[] = ordersRes?.data ?? [];

  const statCards = [
    {
      label: "Total Revenue",
      value: stats ? formatPrice(stats.totalRevenue) : "--",
      icon: DollarSign,
      color: "bg-emerald-500/10 text-emerald-400",
      iconBg: "bg-emerald-500/20",
    },
    {
      label: "Total Orders",
      value: stats ? String(stats.totalOrders) : "--",
      icon: ShoppingCart,
      color: "bg-blue-500/10 text-blue-400",
      iconBg: "bg-blue-500/20",
    },
    {
      label: "Active Products",
      value: stats ? String(stats.activeProducts) : "--",
      icon: Package,
      color: "bg-violet-500/10 text-violet-400",
      iconBg: "bg-violet-500/20",
    },
    {
      label: "Low Stock Items",
      value: stats ? String(stats.lowStockItems) : "--",
      icon: AlertTriangle,
      color: "bg-amber-500/10 text-amber-400",
      iconBg: "bg-amber-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Welcome back. Here is what is happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      {statsError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          Failed to load stats: {(statsError as Error).message}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-400">
                  {stat.label}
                </span>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${stat.color.split(" ")[1]}`} />
                </div>
              </div>
              <div className="mt-3 flex items-end gap-2">
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {stat.value}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/products/new"
          className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-violet-600/50 hover:bg-zinc-800"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/20">
            <Plus className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Add Product</p>
            <p className="text-xs text-zinc-500">Create a new listing</p>
          </div>
          <ArrowUpRight className="ml-auto h-4 w-4 text-zinc-600" />
        </Link>
        <Link
          href="/inventory"
          className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-amber-600/50 hover:bg-zinc-800"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">View Low Stock</p>
            <p className="text-xs text-zinc-500">
              {stats ? `${stats.lowStockItems} items need attention` : "Loading..."}
            </p>
          </div>
          <ArrowUpRight className="ml-auto h-4 w-4 text-zinc-600" />
        </Link>
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition-colors hover:border-blue-600/50 hover:bg-zinc-800"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
            <Download className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Export Orders</p>
            <p className="text-xs text-zinc-500">Download CSV report</p>
          </div>
          <ArrowUpRight className="ml-auto h-4 w-4 text-zinc-600" />
        </button>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <Link
            href="/orders"
            className="text-sm font-medium text-violet-400 hover:text-violet-300"
          >
            View all
          </Link>
        </div>
        {ordersError && (
          <div className="px-6 py-4 text-sm text-red-400">
            Failed to load orders: {(ordersError as Error).message}
          </div>
        )}
        {ordersLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-500">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-zinc-800/50"
                  >
                    <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-violet-400">
                      {order.orderNumber}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-zinc-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-zinc-400">
                      {order.items?.length ?? 0}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-zinc-200">
                      {formatPrice(order.total)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[order.status] ?? "bg-zinc-800 text-zinc-400"}`}
                      >
                        {order.status.toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
