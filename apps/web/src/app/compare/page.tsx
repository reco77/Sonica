import { ComparisonView } from "./ComparisonView";

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Compare Products</h1>
        <p className="mt-2 text-[var(--sonica-text-muted)]">
          Compare specs side-by-side to find the perfect product for your needs
        </p>
      </div>
      <ComparisonView />
    </div>
  );
}
