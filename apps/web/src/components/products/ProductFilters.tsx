"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";

interface FilterSection {
  id: string;
  label: string;
  options: { value: string; label: string; count?: number }[];
}

const filterSections: FilterSection[] = [
  {
    id: "category",
    label: "Category",
    options: [
      { value: "headphones", label: "Headphones" },
      { value: "smartwatches", label: "Smartwatches" },
      { value: "earbuds", label: "Earbuds" },
      { value: "speakers", label: "Speakers" },
    ],
  },
  {
    id: "brand",
    label: "Brand",
    options: [
      { value: "sony", label: "Sony" },
      { value: "apple", label: "Apple" },
      { value: "samsung", label: "Samsung" },
      { value: "bose", label: "Bose" },
      { value: "sennheiser", label: "Sennheiser" },
      { value: "jbl", label: "JBL" },
      { value: "bang-olufsen", label: "Bang & Olufsen" },
    ],
  },
  {
    id: "connectivity",
    label: "Connectivity",
    options: [
      { value: "bluetooth", label: "Bluetooth" },
      { value: "wifi", label: "Wi-Fi" },
      { value: "wired", label: "Wired" },
      { value: "usb-c", label: "USB-C" },
      { value: "nfc", label: "NFC" },
    ],
  },
  {
    id: "features",
    label: "Features",
    options: [
      { value: "noise-cancelling", label: "Noise Cancelling" },
      { value: "waterproof", label: "Waterproof" },
      { value: "wireless-charging", label: "Wireless Charging" },
      { value: "touch-controls", label: "Touch Controls" },
      { value: "voice-assistant", label: "Voice Assistant" },
      { value: "multipoint", label: "Multipoint" },
    ],
  },
];

const priceRanges = [
  { min: 0, max: 50, label: "Under $50" },
  { min: 50, max: 100, label: "$50 - $100" },
  { min: 100, max: 200, label: "$100 - $200" },
  { min: 200, max: 500, label: "$200 - $500" },
  { min: 500, max: Infinity, label: "$500+" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["category", "brand"])
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.getAll(key);

    if (currentValues.includes(value)) {
      params.delete(key);
      currentValues
        .filter((v) => v !== value)
        .forEach((v) => params.append(key, v));
    } else {
      params.append(key, value);
    }

    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const updatePriceRange = (min: number, max: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", min.toString());
    if (max !== Infinity) {
      params.set("maxPrice", max.toString());
    } else {
      params.delete("maxPrice");
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/products");
  };

  const isFilterActive = (key: string, value: string): boolean => {
    return searchParams.getAll(key).includes(value);
  };

  const activeFilterCount = Array.from(searchParams.entries()).filter(
    ([key]) => key !== "sort" && key !== "page"
  ).length;

  const filterContent = (
    <div className="space-y-6">
      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {activeFilterCount} active filter{activeFilterCount !== 1 ? "s" : ""}
          </span>
          <button
            onClick={clearAllFilters}
            className="text-xs text-[var(--sonica-accent)] hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Sections */}
      {filterSections.map((section) => (
        <div
          key={section.id}
          className="border-b border-[var(--sonica-border)] pb-4"
        >
          <button
            onClick={() => toggleSection(section.id)}
            className="flex w-full items-center justify-between py-1 text-sm font-medium"
          >
            {section.label}
            <ChevronDown
              className={`h-4 w-4 text-[var(--sonica-text-muted)] transition-transform ${
                openSections.has(section.id) ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.has(section.id) && (
            <div className="mt-3 space-y-2">
              {section.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={isFilterActive(section.id, option.value)}
                    onChange={() => updateFilter(section.id, option.value)}
                    className="h-4 w-4 rounded border-[var(--sonica-border)] bg-[var(--sonica-surface)] text-[var(--sonica-primary)] focus:ring-[var(--sonica-primary)] focus:ring-offset-0"
                  />
                  <span className="text-sm text-[var(--sonica-text-muted)] group-hover:text-[var(--sonica-text)] transition-colors">
                    {option.label}
                  </span>
                  {option.count !== undefined && (
                    <span className="ml-auto text-xs text-[var(--sonica-text-muted)]">
                      ({option.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Price Range */}
      <div className="border-b border-[var(--sonica-border)] pb-4">
        <button
          onClick={() => toggleSection("price")}
          className="flex w-full items-center justify-between py-1 text-sm font-medium"
        >
          Price Range
          <ChevronDown
            className={`h-4 w-4 text-[var(--sonica-text-muted)] transition-transform ${
              openSections.has("price") ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSections.has("price") && (
          <div className="mt-3 space-y-2">
            {priceRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => updatePriceRange(range.min, range.max)}
                className={`block w-full text-left rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  searchParams.get("minPrice") === range.min.toString()
                    ? "bg-[var(--sonica-primary)]/10 text-[var(--sonica-primary)]"
                    : "text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] hover:bg-[var(--sonica-surface-hover)]"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 rounded-lg border border-[var(--sonica-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--sonica-surface)] transition-colors"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--sonica-primary)] text-[10px] text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-full bg-[var(--sonica-bg)] border-r border-[var(--sonica-border)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">{filterContent}</aside>
    </>
  );
}
