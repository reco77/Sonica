import { Suspense } from "react";
import { ProductDetail } from "./ProductDetail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square rounded-2xl bg-[var(--sonica-surface)]" />
            <div className="space-y-6">
              <div className="h-4 w-20 rounded bg-[var(--sonica-surface)]" />
              <div className="h-8 w-3/4 rounded bg-[var(--sonica-surface)]" />
              <div className="h-10 w-32 rounded bg-[var(--sonica-surface)]" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-[var(--sonica-surface)]" />
                <div className="h-4 w-5/6 rounded bg-[var(--sonica-surface)]" />
                <div className="h-4 w-2/3 rounded bg-[var(--sonica-surface)]" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProductDetail slug={slug} />
    </Suspense>
  );
}
