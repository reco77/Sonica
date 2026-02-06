"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  ChevronDown,
  Headphones,
  Watch,
  Speaker,
  Ear,
  User,
  Zap,
} from "lucide-react";
import { useCartStore, useCartItemCount } from "@/store/cart";

const categories = [
  { name: "Headphones", href: "/products?category=headphones", icon: Headphones },
  { name: "Smartwatches", href: "/products?category=smartwatches", icon: Watch },
  { name: "Earbuds", href: "/products?category=earbuds", icon: Ear },
  { name: "Speakers", href: "/products?category=speakers", icon: Speaker },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartItemCount();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--sonica-border)] bg-[var(--sonica-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Zap className="h-7 w-7 text-[var(--sonica-primary)]" />
            <span className="text-xl font-bold tracking-tight">Sonica</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/products"
              className="px-3 py-2 text-sm font-medium text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors rounded-lg hover:bg-[var(--sonica-surface)]"
            >
              Shop
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors rounded-lg hover:bg-[var(--sonica-surface)]">
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-[var(--sonica-border)] bg-[var(--sonica-surface)] p-2 shadow-2xl">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] hover:bg-[var(--sonica-surface-hover)] transition-colors"
                    >
                      <cat.icon className="h-4 w-4 text-[var(--sonica-accent)]" />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/compare"
              className="px-3 py-2 text-sm font-medium text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors rounded-lg hover:bg-[var(--sonica-surface)]"
            >
              Compare
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--sonica-text-muted)]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[var(--sonica-border)] bg-[var(--sonica-surface)] py-2 pl-10 pr-4 text-sm text-[var(--sonica-text)] placeholder:text-[var(--sonica-text-muted)] focus:border-[var(--sonica-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--sonica-primary)] transition-colors"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* User menu */}
            <button className="p-2 text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors rounded-lg hover:bg-[var(--sonica-surface)]">
              <User className="h-5 w-5" />
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors rounded-lg hover:bg-[var(--sonica-surface)]"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--sonica-primary)] text-[10px] font-bold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--sonica-text-muted)]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-[var(--sonica-border)] bg-[var(--sonica-surface)] py-2 pl-10 pr-4 text-sm text-[var(--sonica-text)] placeholder:text-[var(--sonica-text-muted)] focus:border-[var(--sonica-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--sonica-primary)]"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--sonica-border)] py-4 space-y-1">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] hover:bg-[var(--sonica-surface)]"
            >
              Shop All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] hover:bg-[var(--sonica-surface)]"
              >
                <cat.icon className="h-4 w-4 text-[var(--sonica-accent)]" />
                {cat.name}
              </Link>
            ))}
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] hover:bg-[var(--sonica-surface)]"
            >
              Compare
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
