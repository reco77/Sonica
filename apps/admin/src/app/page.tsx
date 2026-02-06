import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Plus,
  Download,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Mock data -- replace with real API calls
// ---------------------------------------------------------------------------

const stats = [
  {
    label: "Total Revenue",
    value: "$48,290.00",
    change: "+12.5%",
    icon: DollarSign,
    color: "bg-emerald-500/10 text-emerald-400",
    iconBg: "bg-emerald-500/20",
  },
  {
    label: "Orders Today",
    value: "24",
    change: "+3",
    icon: ShoppingCart,
    color: "bg-blue-500/10 text-blue-400",
    iconBg: "bg-blue-500/20",
  },
  {
    label: "Active Products",
    value: "156",
    change: "+8",
    icon: Package,
    color: "bg-violet-500/10 text-violet-400",
    iconBg: "bg-violet-500/20",
  },
  {
    label: "Low Stock Items",
    value: "7",
    change: "-2",
    icon: AlertTriangle,
    color: "bg-amber-500/10 text-amber-400",
    iconBg: "bg-amber-500/20",
  },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Alex Johnson",
    date: "2025-01-15",
    items: 3,
    total: 45900,
    status: "delivered" as const,
  },
  {
    id: "ORD-002",
    customer: "Maria Garcia",
    date: "2025-01-15",
    items: 1,
    total: 29900,
    status: "shipped" as const,
  },
  {
    id: "ORD-003",
    customer: "James Wilson",
    date: "2025-01-14",
    items: 2,
    total: 67800,
    status: "confirmed" as const,
  },
  {
    id: "ORD-004",
    customer: "Sarah Chen",
    date: "2025-01-14",
    items: 1,
    total: 19900,
    status: "pending" as const,
  },
  {
    id: "ORD-005",
    customer: "Daniel Kim",
    date: "2025-01-14",
    items: 4,
    total: 112500,
    status: "delivered" as const,
  },
  {
    id: "ORD-006",
    customer: "Emily Brown",
    date: "2025-01-13",
    items: 2,
    total: 54900,
    status: "shipped" as const,
  },
  {
    id: "ORD-007",
    customer: "Michael Lee",
    date: "2025-01-13",
    items: 1,
    total: 34900,
    status: "confirmed" as const,
  },
  {
    id: "ORD-008",
    customer: "Lisa Wang",
    date: "2025-01-13",
    items: 3,
    total: 89700,
    status: "pending" as const,
  },
  {
    id: "ORD-009",
    customer: "Robert Taylor",
    date: "2025-01-12",
    items: 1,
    total: 24900,
    status: "delivered" as const,
  },
  {
    id: "ORD-010",
    customer: "Anna Martinez",
    date: "2025-01-12",
    items: 2,
    total: 41800,
    status: "shipped" as const,
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  shipped: "bg-violet-500/10 text-violet-400",
  delivered: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-red-500/10 text-red-400",
};

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function DashboardPage() {
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
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
                <span className="text-2xl font-bold text-white">
                  {stat.value}
                </span>
                <span
                  className={`text-xs font-medium ${
                    stat.change.startsWith("+")
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {stat.change}
                </span>
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
            <p className="text-xs text-zinc-500">7 items need attention</p>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
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
                    {order.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-zinc-300">
                    {order.customer}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-zinc-400">
                    {order.date}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-zinc-400">
                    {order.items}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-zinc-200">
                    {formatPrice(order.total)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
