import { Users, Mail, ShoppingBag } from "lucide-react";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockCustomers = [
  {
    id: "c1",
    name: "Alex Johnson",
    email: "alex@example.com",
    orderCount: 5,
    totalSpent: 124500,
    createdAt: "2024-06-15",
  },
  {
    id: "c2",
    name: "Maria Garcia",
    email: "maria@example.com",
    orderCount: 3,
    totalSpent: 89700,
    createdAt: "2024-08-20",
  },
  {
    id: "c3",
    name: "James Wilson",
    email: "james@example.com",
    orderCount: 8,
    totalSpent: 234800,
    createdAt: "2024-03-10",
  },
  {
    id: "c4",
    name: "Sarah Chen",
    email: "sarah@example.com",
    orderCount: 2,
    totalSpent: 49800,
    createdAt: "2024-11-02",
  },
  {
    id: "c5",
    name: "Daniel Kim",
    email: "daniel@example.com",
    orderCount: 12,
    totalSpent: 389500,
    createdAt: "2024-01-25",
  },
  {
    id: "c6",
    name: "Emily Brown",
    email: "emily@example.com",
    orderCount: 4,
    totalSpent: 112300,
    createdAt: "2024-07-18",
  },
  {
    id: "c7",
    name: "Michael Lee",
    email: "michael@example.com",
    orderCount: 1,
    totalSpent: 34900,
    createdAt: "2025-01-05",
  },
  {
    id: "c8",
    name: "Lisa Wang",
    email: "lisa@example.com",
    orderCount: 6,
    totalSpent: 178400,
    createdAt: "2024-05-30",
  },
];

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="mt-1 text-sm text-zinc-400">
          View and manage your customer base
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Total Customers</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {mockCustomers.length}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Total Orders</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {mockCustomers.reduce((sum, c) => sum + c.orderCount, 0)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {formatPrice(
              mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0)
            )}
          </p>
        </div>
      </div>

      {/* Customers Table */}
      {mockCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16">
          <Users className="h-12 w-12 text-zinc-700" />
          <p className="mt-4 text-sm font-medium text-zinc-400">
            No customers yet
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Orders</th>
                  <th className="px-6 py-3">Total Spent</th>
                  <th className="px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {mockCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition-colors hover:bg-zinc-800/50"
                  >
                    <td className="whitespace-nowrap px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600/20 text-sm font-medium text-violet-400">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="text-sm font-medium text-zinc-200">
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                        <Mail className="h-3.5 w-3.5" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-zinc-300">
                        <ShoppingBag className="h-3.5 w-3.5 text-zinc-500" />
                        {customer.orderCount}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-zinc-200">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-zinc-500">
                      {customer.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
