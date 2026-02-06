import Link from "next/link";
import {
  Headphones,
  Watch,
  Speaker,
  Ear,
  ArrowRight,
  Zap,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { FeaturedProducts } from "./FeaturedProducts";

const categories = [
  {
    name: "Headphones",
    description: "Over-ear & on-ear audio",
    href: "/products?category=headphones",
    icon: Headphones,
    gradient: "from-indigo-500/20 to-purple-500/20",
  },
  {
    name: "Smartwatches",
    description: "Fitness & lifestyle wearables",
    href: "/products?category=smartwatches",
    icon: Watch,
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    name: "Earbuds",
    description: "True wireless & in-ear",
    href: "/products?category=earbuds",
    icon: Ear,
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    name: "Speakers",
    description: "Portable & home audio",
    href: "/products?category=speakers",
    icon: Speaker,
    gradient: "from-orange-500/20 to-red-500/20",
  },
];

const brands = [
  "Sony",
  "Apple",
  "Samsung",
  "Bose",
  "Sennheiser",
  "JBL",
  "Bang & Olufsen",
  "Beats",
];

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $99",
  },
  {
    icon: Shield,
    title: "2-Year Warranty",
    description: "Extended protection",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    description: "Hassle-free returns",
  },
  {
    icon: Zap,
    title: "Expert Support",
    description: "Tech specialists on hand",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--sonica-primary)]/10 via-transparent to-[var(--sonica-accent)]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[var(--sonica-primary)]/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--sonica-border)] bg-[var(--sonica-surface)] px-4 py-1.5 text-sm text-[var(--sonica-text-muted)] mb-6">
              <Zap className="h-3.5 w-3.5 text-[var(--sonica-accent)]" />
              New arrivals now available
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Premium Tech{" "}
              <span className="bg-gradient-to-r from-[var(--sonica-primary)] to-[var(--sonica-accent)] bg-clip-text text-transparent">
                Accessories
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[var(--sonica-text-muted)] max-w-xl leading-relaxed">
              Discover curated collections of headphones, smartwatches, earbuds,
              and speakers from the world&apos;s leading brands.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--sonica-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--sonica-primary-dark)] transition-colors shadow-lg shadow-[var(--sonica-primary)]/25"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--sonica-border)] px-6 py-3 text-sm font-semibold hover:bg-[var(--sonica-surface)] transition-colors"
              >
                Compare Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bar */}
      <section className="border-y border-[var(--sonica-border)] bg-[var(--sonica-surface)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[var(--sonica-border)]">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 py-5 px-4 lg:px-6"
              >
                <feature.icon className="h-5 w-5 text-[var(--sonica-accent)] shrink-0" />
                <div>
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-[var(--sonica-text-muted)]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <p className="mt-3 text-[var(--sonica-text-muted)]">
            Find the perfect tech accessory for your needs
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative flex flex-col items-center gap-4 rounded-2xl border border-[var(--sonica-border)] bg-[var(--sonica-surface)] p-8 hover:border-[var(--sonica-primary)]/50 transition-all duration-300 overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--sonica-bg)] border border-[var(--sonica-border)] group-hover:border-[var(--sonica-primary)]/30 transition-colors">
                <category.icon className="h-7 w-7 text-[var(--sonica-primary)] group-hover:text-[var(--sonica-accent)] transition-colors" />
              </div>
              <div className="relative z-10 text-center">
                <h3 className="font-semibold group-hover:text-[var(--sonica-primary)] transition-colors">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--sonica-text-muted)]">
                  {category.description}
                </p>
              </div>
              <ArrowRight className="relative z-10 h-4 w-4 text-[var(--sonica-text-muted)] group-hover:text-[var(--sonica-primary)] group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-[var(--sonica-border)]">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="mt-2 text-[var(--sonica-text-muted)]">
              Handpicked by our tech experts
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[var(--sonica-primary)] hover:text-[var(--sonica-accent)] transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <FeaturedProducts />
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--sonica-primary)] hover:text-[var(--sonica-accent)] transition-colors"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Brand Bar */}
      <section className="border-t border-[var(--sonica-border)] bg-[var(--sonica-surface)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-sm text-[var(--sonica-text-muted)] mb-8">
            Trusted brands we carry
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/products?brand=${brand.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-lg font-semibold text-[var(--sonica-text-muted)]/40 hover:text-[var(--sonica-text-muted)] transition-colors"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
