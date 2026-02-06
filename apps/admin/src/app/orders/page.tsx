"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
  Loader2,
} from "lucide-react";
import type { OrderStatus } from "@sonica/shared";
import { ORDER_STATUS_VALUES } from "@sonica/shared";
import {
  getOrders,
  getOrder,
  updateOrderStatus,
} from "../../lib/api";
import type { ApiOrder } from "../../lib/api";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusTabs: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusConfig: Record<
  string,
  { color: string; icon: React.ElementType }
> = {
  PENDING: { color: "bg-yellow-500/10 text-yellow-400", icon: Clock },
  CONFIRMED: { color: "bg-blue-500/10 text-blue-400", icon: CheckCircle },
  SHIPPED: { color: "bg-violet-500/10 text-violet-400", icon: Truck },
  DELIVERED: { color: "bg-emerald-500/10 text-emerald-400", icon: PackageCheck },
  CANCELLED: { color: "bg-red-500/10 text-red-400", icon: XCircle },
  pending: { color: "bg-yellow-500/10 text-yellow-400", icon: Clock },
  confirmed: { color: "bg-blue-500/10 text-blue-400", icon: CheckCircle },
  shipped: { color: "bg-violet-500/10 text-violet-400", icon: Truck },
  delivered: { color: "bg-emerald-500/10 text-emerald-400", icon: PackageCheck },
  cancelled: { color: "bg-red-500/10 text-red-400", icon: XCircle },
};

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", statusFilter, page],
    queryFn: () =>
      getOrders({
        status: statusFilter !== "all" ? statusFilter : undefined,
        page,
        limit: 20,
      }),
  });

  const { data: expandedOrderData } = useQuery({
    queryKey: ["order-detail", expandedOrderId],
    queryFn: () => getOrder(expandedOrderId!),
    enabled: !!expandedOrderId,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: OrderStatus;
    }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-detail"] });
    },
  });

  const orders = data?.data ?? [];
  const pagination = data?.pagination;

  // Client-side search filter
  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      (o.user?.email?.toLowerCase().includes(q) ?? false) ||
      (o.user?.name?.toLowerCase().includes(q) ?? false)
    );
  });

  const expandedDetail = expandedOrderData?.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="mt-1 text-sm text-zinc-400">
          View and manage customer orders
          {pagination ? ` (${pagination.total} total)` : ""}
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-1">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
            }}
            className={`flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by order #, customer, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          Failed to load orders: {(error as Error).message}
        </div>
      )}

      {/* Orders Table */}
      {isLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16">
          <ShoppingCart className="h-12 w-12 text-zinc-700" />
          <p className="mt-4 text-sm font-medium text-zinc-400">
            No orders found
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-3">Order #</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((order) => {
                  const normalizedStatus = order.status.toLowerCase();
                  const cfg = statusConfig[order.status] ??
                    statusConfig[normalizedStatus] ?? {
                      color: "bg-zinc-800 text-zinc-400",
                      icon: Clock,
                    };
                  const StatusIcon = cfg.icon;
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <tr key={order.id} className="group">
                      <td className="whitespace-nowrap px-6 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedOrderId(isExpanded ? null : order.id)
                          }
                          className="text-sm font-medium text-violet-400 hover:text-violet-300"
                        >
                          {order.orderNumber}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-sm text-zinc-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-sm text-zinc-400">
                        {order.items?.length ?? 0} item
                        {(order.items?.length ?? 0) !== 1 ? "s" : ""}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-zinc-200">
                        {formatPrice(order.total)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cfg.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {normalizedStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <div className="relative">
                          <select
                            value={normalizedStatus}
                            onChange={(e) =>
                              statusMutation.mutate({
                                id: order.id,
                                status: e.target.value as OrderStatus,
                              })
                            }
                            disabled={statusMutation.isPending}
                            className="appearance-none rounded-lg border border-zinc-700 bg-zinc-800 py-1.5 pl-3 pr-8 text-xs text-zinc-300 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                          >
                            {ORDER_STATUS_VALUES.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-500" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-3">
              <p className="text-sm text-zinc-500">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expanded Order Detail Panel */}
      {expandedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Order{" "}
                {expandedDetail?.orderNumber ?? expandedOrderId.slice(0, 8)}
              </h2>
              <button
                type="button"
                onClick={() => setExpandedOrderId(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {expandedDetail ? (
              <div className="mt-4 space-y-4">
                {/* Order info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Order Number</span>
                    <span className="text-zinc-200">
                      {expandedDetail.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Date</span>
                    <span className="text-zinc-200">
                      {formatDate(expandedDetail.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Status</span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${(statusConfig[expandedDetail.status] ?? statusConfig.pending).color}`}
                    >
                      {expandedDetail.status.toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-zinc-300">
                    Items
                  </h3>
                  <div className="space-y-2">
                    {expandedDetail.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-zinc-200">
                            {item.productName}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {item.variantColor} x {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-zinc-300">
                          {formatPrice(item.priceAtPurchase * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {expandedDetail.shippingAddress && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-zinc-300">
                      Shipping Address
                    </h3>
                    <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-400">
                      {typeof expandedDetail.shippingAddress === "object" && (
                        <>
                          <p>
                            {(expandedDetail.shippingAddress as Record<string, string>).fullName}
                          </p>
                          <p>
                            {(expandedDetail.shippingAddress as Record<string, string>).line1}
                          </p>
                          {(expandedDetail.shippingAddress as Record<string, string>).line2 && (
                            <p>
                              {(expandedDetail.shippingAddress as Record<string, string>).line2}
                            </p>
                          )}
                          <p>
                            {(expandedDetail.shippingAddress as Record<string, string>).city},{" "}
                            {(expandedDetail.shippingAddress as Record<string, string>).state}{" "}
                            {(expandedDetail.shippingAddress as Record<string, string>).postalCode}
                          </p>
                          <p>
                            {(expandedDetail.shippingAddress as Record<string, string>).country}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-1 border-t border-zinc-800 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Subtotal</span>
                    <span className="text-zinc-300">
                      {formatPrice(expandedDetail.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Tax</span>
                    <span className="text-zinc-300">
                      {formatPrice(expandedDetail.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Shipping</span>
                    <span className="text-zinc-300">
                      {expandedDetail.shippingCost === 0
                        ? "Free"
                        : formatPrice(expandedDetail.shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-zinc-200">Total</span>
                    <span className="text-white">
                      {formatPrice(expandedDetail.total)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setExpandedOrderId(null)}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
