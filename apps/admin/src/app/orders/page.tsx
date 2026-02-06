"use client";

import { useState } from "react";
import {
  Search,
  ShoppingCart,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
} from "lucide-react";
import type { OrderStatus } from "@sonica/shared";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface MockOrder {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
}

const mockOrders: MockOrder[] = [
  {
    id: "ORD-1001",
    customer: "Alex Johnson",
    email: "alex@example.com",
    date: "2025-01-15T10:30:00Z",
    items: 3,
    total: 45900,
    status: "delivered",
  },
  {
    id: "ORD-1002",
    customer: "Maria Garcia",
    email: "maria@example.com",
    date: "2025-01-15T09:15:00Z",
    items: 1,
    total: 29900,
    status: "shipped",
  },
  {
    id: "ORD-1003",
    customer: "James Wilson",
    email: "james@example.com",
    date: "2025-01-14T16:45:00Z",
    items: 2,
    total: 67800,
    status: "confirmed",
  },
  {
    id: "ORD-1004",
    customer: "Sarah Chen",
    email: "sarah@example.com",
    date: "2025-01-14T14:20:00Z",
    items: 1,
    total: 19900,
    status: "pending",
  },
  {
    id: "ORD-1005",
    customer: "Daniel Kim",
    email: "daniel@example.com",
    date: "2025-01-14T11:00:00Z",
    items: 4,
    total: 112500,
    status: "delivered",
  },
  {
    id: "ORD-1006",
    customer: "Emily Brown",
    email: "emily@example.com",
    date: "2025-01-13T18:30:00Z",
    items: 2,
    total: 54900,
    status: "shipped",
  },
  {
    id: "ORD-1007",
    customer: "Michael Lee",
    email: "michael@example.com",
    date: "2025-01-13T13:15:00Z",
    items: 1,
    total: 34900,
    status: "confirmed",
  },
  {
    id: "ORD-1008",
    customer: "Lisa Wang",
    email: "lisa@example.com",
    date: "2025-01-13T10:45:00Z",
    items: 3,
    total: 89700,
    status: "pending",
  },
  {
    id: "ORD-1009",
    customer: "Robert Taylor",
    email: "robert@example.com",
    date: "2025-01-12T15:00:00Z",
    items: 1,
    total: 24900,
    status: "delivered",
  },
  {
    id: "ORD-1010",
    customer: "Anna Martinez",
    email: "anna@example.com",
    date: "2025-01-12T09:30:00Z",
    items: 2,
    total: 41800,
    status: "cancelled",
  },
  {
    id: "ORD-1011",
    customer: "Chris Davis",
    email: "chris@example.com",
    date: "2025-01-11T14:15:00Z",
    items: 1,
    total: 17900,
    status: "delivered",
  },
  {
    id: "ORD-1012",
    customer: "Sophie Turner",
    email: "sophie@example.com",
    date: "2025-01-11T11:00:00Z",
    items: 5,
    total: 139500,
    status: "shipped",
  },
];

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
  OrderStatus,
  { color: string; icon: React.ElementType }
> = {
  pending: {
    color: "bg-yellow-500/10 text-yellow-400",
    icon: Clock,
  },
  confirmed: {
    color: "bg-blue-500/10 text-blue-400",
    icon: CheckCircle,
  },
  shipped: {
    color: "bg-violet-500/10 text-violet-400",
    icon: Truck,
  },
  delivered: {
    color: "bg-emerald-500/10 text-emerald-400",
    icon: PackageCheck,
  },
  cancelled: {
    color: "bg-red-500/10 text-red-400",
    icon: XCircle,
  },
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<MockOrder | null>(null);

  const filtered = mockOrders.filter((o) => {
    const matchesStatus =
      statusFilter === "all" || o.status === statusFilter;
    const matchesSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="mt-1 text-sm text-zinc-400">
          View and manage customer orders
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-1">
        {statusTabs.map((tab) => {
          const count =
            tab.value === "all"
              ? mockOrders.length
              : mockOrders.filter((o) => o.status === tab.value).length;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  statusFilter === tab.value
                    ? "bg-zinc-700 text-zinc-200"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
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

      {/* Orders Table */}
      {filtered.length === 0 ? (
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
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((order) => {
                  const cfg = statusConfig[order.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <tr
                      key={order.id}
                      className="cursor-pointer transition-colors hover:bg-zinc-800/50"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-violet-400">
                        {order.id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <div>
                          <p className="text-sm font-medium text-zinc-200">
                            {order.customer}
                          </p>
                          <p className="text-xs text-zinc-500">{order.email}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-sm text-zinc-400">
                        {formatDate(order.date)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-sm text-zinc-400">
                        {order.items} item{order.items !== 1 ? "s" : ""}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-zinc-200">
                        {formatPrice(order.total)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cfg.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {order.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <ChevronRight className="h-4 w-4 text-zinc-600" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Order {selectedOrder.id}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Customer</span>
                <span className="text-zinc-200">{selectedOrder.customer}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Email</span>
                <span className="text-zinc-200">{selectedOrder.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Date</span>
                <span className="text-zinc-200">
                  {formatDate(selectedOrder.date)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Items</span>
                <span className="text-zinc-200">{selectedOrder.items}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Total</span>
                <span className="text-lg font-bold text-white">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusConfig[selectedOrder.status].color}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                Close
              </button>
              <button
                type="button"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
