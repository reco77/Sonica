"use client";

import { useState } from "react";
import {
  Warehouse,
  AlertTriangle,
  Search,
  Save,
  Package,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface InventoryRow {
  productId: string;
  productName: string;
  variantId: string;
  color: string;
  colorHex: string;
  edition?: string;
  sku: string;
  stock: number;
  price: number;
}

const initialInventory: InventoryRow[] = [
  {
    productId: "1",
    productName: "Sony WH-1000XM5",
    variantId: "v1",
    color: "Black",
    colorHex: "#1A1A1A",
    sku: "SONY-WH1000XM5-BLK",
    stock: 25,
    price: 34900,
  },
  {
    productId: "1",
    productName: "Sony WH-1000XM5",
    variantId: "v2",
    color: "Silver",
    colorHex: "#C0C0C0",
    sku: "SONY-WH1000XM5-SLV",
    stock: 12,
    price: 34900,
  },
  {
    productId: "1",
    productName: "Sony WH-1000XM5",
    variantId: "v3",
    color: "Midnight Blue",
    colorHex: "#191970",
    edition: "Limited Edition",
    sku: "SONY-WH1000XM5-BLU-LE",
    stock: 8,
    price: 39900,
  },
  {
    productId: "2",
    productName: "Apple AirPods Pro 2",
    variantId: "v4",
    color: "White",
    colorHex: "#FFFFFF",
    sku: "APPLE-APP2-WHT",
    stock: 120,
    price: 24900,
  },
  {
    productId: "3",
    productName: "Samsung Galaxy Watch 6",
    variantId: "v5",
    color: "Graphite",
    colorHex: "#383838",
    sku: "SAM-GW6-GRP-40",
    stock: 15,
    price: 29900,
  },
  {
    productId: "3",
    productName: "Samsung Galaxy Watch 6",
    variantId: "v6",
    color: "Gold",
    colorHex: "#FFD700",
    sku: "SAM-GW6-GLD-40",
    stock: 3,
    price: 32900,
  },
  {
    productId: "3",
    productName: "Samsung Galaxy Watch 6",
    variantId: "v7",
    color: "Silver",
    colorHex: "#C0C0C0",
    sku: "SAM-GW6-SLV-44",
    stock: 7,
    price: 34900,
  },
  {
    productId: "3",
    productName: "Samsung Galaxy Watch 6",
    variantId: "v8",
    color: "Graphite",
    colorHex: "#383838",
    sku: "SAM-GW6-GRP-44",
    stock: 5,
    price: 34900,
  },
  {
    productId: "4",
    productName: "JBL Charge 5",
    variantId: "v9",
    color: "Black",
    colorHex: "#000000",
    sku: "JBL-C5-BLK",
    stock: 45,
    price: 17900,
  },
  {
    productId: "4",
    productName: "JBL Charge 5",
    variantId: "v10",
    color: "Blue",
    colorHex: "#0000FF",
    sku: "JBL-C5-BLU",
    stock: 40,
    price: 17900,
  },
  {
    productId: "5",
    productName: "Bose QuietComfort Ultra",
    variantId: "v11",
    color: "Black",
    colorHex: "#1A1A1A",
    sku: "BOSE-QCU-BLK",
    stock: 5,
    price: 42900,
  },
  {
    productId: "5",
    productName: "Bose QuietComfort Ultra",
    variantId: "v12",
    color: "White Smoke",
    colorHex: "#F5F5F5",
    sku: "BOSE-QCU-WHT",
    stock: 3,
    price: 42900,
  },
  {
    productId: "6",
    productName: "Jabra Elite 85t",
    variantId: "v13",
    color: "Titanium Black",
    colorHex: "#2C2C2C",
    sku: "JAB-E85T-TBK",
    stock: 0,
    price: 19900,
  },
  {
    productId: "6",
    productName: "Jabra Elite 85t",
    variantId: "v14",
    color: "Gold Beige",
    colorHex: "#C8A96E",
    sku: "JAB-E85T-GBG",
    stock: 0,
    price: 19900,
  },
  {
    productId: "6",
    productName: "Jabra Elite 85t",
    variantId: "v15",
    color: "Grey",
    colorHex: "#808080",
    sku: "JAB-E85T-GRY",
    stock: 0,
    price: 22900,
  },
];

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function stockStatusColor(stock: number): string {
  if (stock === 0) return "text-red-400";
  if (stock <= 10) return "text-amber-400";
  return "text-emerald-400";
}

function stockBadge(stock: number): { label: string; cls: string } {
  if (stock === 0)
    return {
      label: "Out of Stock",
      cls: "bg-red-500/10 text-red-400",
    };
  if (stock <= 10)
    return {
      label: "Low Stock",
      cls: "bg-amber-500/10 text-amber-400",
    };
  return {
    label: "In Stock",
    cls: "bg-emerald-500/10 text-emerald-400",
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function InventoryPage() {
  const [inventory, setInventory] = useState(initialInventory);
  const [search, setSearch] = useState("");
  const [editedStocks, setEditedStocks] = useState<
    Record<string, number | undefined>
  >({});

  const lowStockItems = inventory.filter((item) => item.stock <= 10);

  const filtered = inventory.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.productName.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.color.toLowerCase().includes(q)
    );
  });

  const handleStockChange = (variantId: string, value: string) => {
    const num = parseInt(value, 10);
    setEditedStocks((prev) => ({
      ...prev,
      [variantId]: isNaN(num) ? undefined : num,
    }));
  };

  const saveStock = (variantId: string) => {
    const newStock = editedStocks[variantId];
    if (newStock === undefined) return;
    setInventory((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, stock: newStock } : item
      )
    );
    setEditedStocks((prev) => {
      const next = { ...prev };
      delete next[variantId];
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Inventory</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Monitor and update stock levels for all product variants
        </p>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h2 className="text-sm font-semibold text-amber-300">
              Low Stock Alerts ({lowStockItems.length} items)
            </h2>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {lowStockItems.map((item) => (
              <div
                key={item.variantId}
                className="flex items-center justify-between rounded-lg border border-amber-500/10 bg-zinc-900 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-200">
                    {item.productName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {item.color} &middot; {item.sku}
                  </p>
                </div>
                <span
                  className={`ml-3 text-sm font-bold ${stockStatusColor(item.stock)}`}
                >
                  {item.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by product, SKU, or color..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
      </div>

      {/* Inventory Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16">
          <Warehouse className="h-12 w-12 text-zinc-700" />
          <p className="mt-4 text-sm font-medium text-zinc-400">
            No inventory items found
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Variant</th>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((item) => {
                  const badge = stockBadge(item.stock);
                  const editedValue = editedStocks[item.variantId];
                  const hasEdit = editedValue !== undefined;
                  return (
                    <tr
                      key={item.variantId}
                      className="transition-colors hover:bg-zinc-800/50"
                    >
                      <td className="whitespace-nowrap px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-800">
                            <Package className="h-4 w-4 text-zinc-500" />
                          </div>
                          <span className="text-sm font-medium text-zinc-200">
                            {item.productName}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block h-4 w-4 rounded-full border border-zinc-600"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="text-sm text-zinc-300">
                            {item.color}
                          </span>
                          {item.edition && (
                            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">
                              {item.edition}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-sm font-mono text-zinc-400">
                        {item.sku}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-sm text-zinc-300">
                        {formatPrice(item.price)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <span
                          className={`text-sm font-bold ${stockStatusColor(item.stock)}`}
                        >
                          {item.stock}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={
                              hasEdit ? editedValue : item.stock
                            }
                            onChange={(e) =>
                              handleStockChange(
                                item.variantId,
                                e.target.value
                              )
                            }
                            className="w-20 rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                          <button
                            type="button"
                            onClick={() => saveStock(item.variantId)}
                            disabled={!hasEdit}
                            className={`rounded p-1.5 transition-colors ${
                              hasEdit
                                ? "text-violet-400 hover:bg-violet-500/10"
                                : "cursor-not-allowed text-zinc-700"
                            }`}
                            title="Save stock update"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
