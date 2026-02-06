import { Suspense } from "react";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "./ProductGrid";

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="mt-2 text-[var(--sonica-text-muted)]">
          Browse our complete collection of premium tech accessories
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <Suspense fallback={null}>
          <ProductFilters />
        </Suspense>

        {/* Product Grid */}
        <div className="flex-1">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col rounded-xl border border-[var(--sonica-border)] bg-[var(--sonica-surface)] overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square bg-[var(--sonica-bg)]" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 w-16 rounded bg-[var(--sonica-bg)]" />
                      <div className="h-4 w-full rounded bg-[var(--sonica-bg)]" />
                      <div className="h-6 w-24 rounded bg-[var(--sonica-bg)]" />
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <ProductGrid searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
