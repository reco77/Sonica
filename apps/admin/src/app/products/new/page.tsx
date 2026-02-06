"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Save,
} from "lucide-react";
import type { ProductCategory } from "@sonica/shared";
import {
  PRODUCT_CATEGORIES,
  CONNECTIVITY_OPTIONS,
  COMPATIBILITY_OPTIONS,
  BRANDS,
} from "@sonica/shared";

// ---------------------------------------------------------------------------
// Types for form state
// ---------------------------------------------------------------------------

interface VariantForm {
  key: string;
  color: string;
  colorHex: string;
  edition: string;
  sku: string;
  price: string;
  compareAtPrice: string;
  stock: string;
}

function emptyVariant(): VariantForm {
  return {
    key: crypto.randomUUID(),
    color: "",
    colorHex: "#000000",
    edition: "",
    sku: "",
    price: "",
    compareAtPrice: "",
    stock: "",
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NewProductPage() {
  // Basic info
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [brand, setBrand] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [featured, setFeatured] = useState(false);
  const [releaseDate, setReleaseDate] = useState("");

  // Specs
  const [driverSize, setDriverSize] = useState("");
  const [freqMin, setFreqMin] = useState("");
  const [freqMax, setFreqMax] = useState("");
  const [impedance, setImpedance] = useState("");
  const [sensitivity, setSensitivity] = useState("");
  const [noiseCancellation, setNoiseCancellation] = useState(false);
  const [codecs, setCodecs] = useState("");
  const [cableLength, setCableLength] = useState("");

  // Smartwatch specs
  const [displaySize, setDisplaySize] = useState("");
  const [displayType, setDisplayType] = useState("");
  const [os, setOs] = useState("");
  const [sensors, setSensors] = useState("");
  const [gps, setGps] = useState(false);
  const [waterRating, setWaterRating] = useState("");
  const [strapWidth, setStrapWidth] = useState("");

  // Earbuds specs
  const [earbudsDriverSize, setEarbudsDriverSize] = useState("");
  const [ancLevel, setAncLevel] = useState<"none" | "basic" | "advanced">(
    "none"
  );
  const [transparencyMode, setTransparencyMode] = useState(false);
  const [stemDesign, setStemDesign] = useState<"stem" | "stemless">("stem");

  // Speaker specs
  const [wattage, setWattage] = useState("");
  const [driverCount, setDriverCount] = useState("");
  const [speakerBatteryLife, setSpeakerBatteryLife] = useState("");
  const [speakerWaterRating, setSpeakerWaterRating] = useState("");

  // Connectivity
  const [bluetoothVersion, setBluetoothVersion] = useState("");
  const [wifi, setWifi] = useState(false);
  const [usbC, setUsbC] = useState(false);
  const [auxJack, setAuxJack] = useState(false);

  // Battery
  const [batteryHours, setBatteryHours] = useState("");
  const [chargingTime, setChargingTime] = useState("");
  const [wirelessCharging, setWirelessCharging] = useState(false);

  // Compatibility
  const [compatibility, setCompatibility] = useState<string[]>([]);

  // Variants
  const [variants, setVariants] = useState<VariantForm[]>([emptyVariant()]);

  const handleNameChange = useCallback(
    (val: string) => {
      setName(val);
      if (autoSlug) setSlug(slugify(val));
    },
    [autoSlug]
  );

  const addVariant = () => setVariants((prev) => [...prev, emptyVariant()]);

  const removeVariant = (key: string) =>
    setVariants((prev) => prev.filter((v) => v.key !== key));

  const updateVariant = (key: string, field: keyof VariantForm, value: string) =>
    setVariants((prev) =>
      prev.map((v) => (v.key === key ? { ...v, [field]: value } : v))
    );

  const toggleCompatibility = (opt: string) => {
    setCompatibility((prev) =>
      prev.includes(opt) ? prev.filter((c) => c !== opt) : [...prev, opt]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: validate & submit via API
    alert("Product saved (placeholder)");
  };

  // Shared input styles
  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500";
  const labelCls = "block text-sm font-medium text-zinc-300 mb-1.5";
  const sectionCls =
    "rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Add New Product</h1>
          <p className="mt-0.5 text-sm text-zinc-400">
            Fill in the details to create a new product listing
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          <Save className="h-4 w-4" />
          Save Product
        </button>
      </div>

      {/* Basic Info */}
      <div className={sectionCls}>
        <h2 className="text-lg font-semibold text-white">Basic Information</h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelCls}>
              Product Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label htmlFor="slug" className={labelCls}>
              Slug
              <button
                type="button"
                onClick={() => setAutoSlug(!autoSlug)}
                className="ml-2 text-xs text-violet-400 hover:text-violet-300"
              >
                {autoSlug ? "(auto)" : "(manual)"}
              </button>
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setAutoSlug(false);
                setSlug(e.target.value);
              }}
              placeholder="product-slug"
              className={inputCls}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="brand" className={labelCls}>
              Brand
            </label>
            <select
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className={inputCls}
              required
            >
              <option value="">Select brand</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="category" className={labelCls}>
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className={inputCls}
              required
            >
              <option value="">Select category</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="tagline" className={labelCls}>
            Tagline
          </label>
          <input
            id="tagline"
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Short marketing tagline"
            className={inputCls}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className={labelCls}>
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Detailed product description..."
            className={inputCls}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="releaseDate" className={labelCls}>
              Release Date
            </label>
            <input
              id="releaseDate"
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-violet-600 focus:ring-violet-500"
              />
              Featured product
            </label>
          </div>
        </div>
      </div>

      {/* Category-Specific Specs */}
      {category === "headphones" && (
        <div className={sectionCls}>
          <h2 className="text-lg font-semibold text-white">
            Headphone Specifications
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label htmlFor="driverSize" className={labelCls}>
                Driver Size (mm)
              </label>
              <input
                id="driverSize"
                type="number"
                value={driverSize}
                onChange={(e) => setDriverSize(e.target.value)}
                placeholder="40"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="impedance" className={labelCls}>
                Impedance (Ohms)
              </label>
              <input
                id="impedance"
                type="number"
                value={impedance}
                onChange={(e) => setImpedance(e.target.value)}
                placeholder="32"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="sensitivity" className={labelCls}>
                Sensitivity (dB)
              </label>
              <input
                id="sensitivity"
                type="number"
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value)}
                placeholder="102"
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="freqMin" className={labelCls}>
                Frequency Range Min (Hz)
              </label>
              <input
                id="freqMin"
                type="number"
                value={freqMin}
                onChange={(e) => setFreqMin(e.target.value)}
                placeholder="4"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="freqMax" className={labelCls}>
                Frequency Range Max (Hz)
              </label>
              <input
                id="freqMax"
                type="number"
                value={freqMax}
                onChange={(e) => setFreqMax(e.target.value)}
                placeholder="40000"
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="codecs" className={labelCls}>
                Codecs (comma-separated)
              </label>
              <input
                id="codecs"
                type="text"
                value={codecs}
                onChange={(e) => setCodecs(e.target.value)}
                placeholder="SBC, AAC, LDAC"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="cableLength" className={labelCls}>
                Cable Length (m, optional)
              </label>
              <input
                id="cableLength"
                type="number"
                step="0.1"
                value={cableLength}
                onChange={(e) => setCableLength(e.target.value)}
                placeholder="1.2"
                className={inputCls}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={noiseCancellation}
              onChange={(e) => setNoiseCancellation(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-violet-600 focus:ring-violet-500"
            />
            Active Noise Cancellation
          </label>
        </div>
      )}

      {category === "smartwatch" && (
        <div className={sectionCls}>
          <h2 className="text-lg font-semibold text-white">
            Smartwatch Specifications
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label htmlFor="displaySize" className={labelCls}>
                Display Size (inches)
              </label>
              <input
                id="displaySize"
                type="number"
                step="0.01"
                value={displaySize}
                onChange={(e) => setDisplaySize(e.target.value)}
                placeholder="1.4"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="displayType" className={labelCls}>
                Display Type
              </label>
              <input
                id="displayType"
                type="text"
                value={displayType}
                onChange={(e) => setDisplayType(e.target.value)}
                placeholder="AMOLED"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="strapWidth" className={labelCls}>
                Strap Width (mm)
              </label>
              <input
                id="strapWidth"
                type="number"
                value={strapWidth}
                onChange={(e) => setStrapWidth(e.target.value)}
                placeholder="20"
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="os" className={labelCls}>
                Operating System
              </label>
              <input
                id="os"
                type="text"
                value={os}
                onChange={(e) => setOs(e.target.value)}
                placeholder="Wear OS"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="swWaterRating" className={labelCls}>
                Water Rating
              </label>
              <input
                id="swWaterRating"
                type="text"
                value={waterRating}
                onChange={(e) => setWaterRating(e.target.value)}
                placeholder="5ATM"
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label htmlFor="sensors" className={labelCls}>
              Sensors (comma-separated)
            </label>
            <input
              id="sensors"
              type="text"
              value={sensors}
              onChange={(e) => setSensors(e.target.value)}
              placeholder="Heart Rate, SpO2, Accelerometer"
              className={inputCls}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={gps}
              onChange={(e) => setGps(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-violet-600 focus:ring-violet-500"
            />
            Built-in GPS
          </label>
        </div>
      )}

      {category === "earbuds" && (
        <div className={sectionCls}>
          <h2 className="text-lg font-semibold text-white">
            Earbuds Specifications
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="earbudsDriverSize" className={labelCls}>
                Driver Size (mm)
              </label>
              <input
                id="earbudsDriverSize"
                type="number"
                value={earbudsDriverSize}
                onChange={(e) => setEarbudsDriverSize(e.target.value)}
                placeholder="11"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="ancLevel" className={labelCls}>
                ANC Level
              </label>
              <select
                id="ancLevel"
                value={ancLevel}
                onChange={(e) =>
                  setAncLevel(
                    e.target.value as "none" | "basic" | "advanced"
                  )
                }
                className={inputCls}
              >
                <option value="none">None</option>
                <option value="basic">Basic</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="stemDesign" className={labelCls}>
                Stem Design
              </label>
              <select
                id="stemDesign"
                value={stemDesign}
                onChange={(e) =>
                  setStemDesign(e.target.value as "stem" | "stemless")
                }
                className={inputCls}
              >
                <option value="stem">Stem</option>
                <option value="stemless">Stemless</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={transparencyMode}
                  onChange={(e) => setTransparencyMode(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-violet-600 focus:ring-violet-500"
                />
                Transparency Mode
              </label>
            </div>
          </div>
        </div>
      )}

      {category === "speaker" && (
        <div className={sectionCls}>
          <h2 className="text-lg font-semibold text-white">
            Speaker Specifications
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="wattage" className={labelCls}>
                Wattage (W)
              </label>
              <input
                id="wattage"
                type="number"
                value={wattage}
                onChange={(e) => setWattage(e.target.value)}
                placeholder="40"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="driverCount" className={labelCls}>
                Driver Count
              </label>
              <input
                id="driverCount"
                type="number"
                value={driverCount}
                onChange={(e) => setDriverCount(e.target.value)}
                placeholder="2"
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="speakerBattery" className={labelCls}>
                Battery Life (hours)
              </label>
              <input
                id="speakerBattery"
                type="number"
                value={speakerBatteryLife}
                onChange={(e) => setSpeakerBatteryLife(e.target.value)}
                placeholder="20"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="spkWaterRating" className={labelCls}>
                Water Rating
              </label>
              <input
                id="spkWaterRating"
                type="text"
                value={speakerWaterRating}
                onChange={(e) => setSpeakerWaterRating(e.target.value)}
                placeholder="IP67"
                className={inputCls}
              />
            </div>
          </div>
        </div>
      )}

      {/* Connectivity */}
      <div className={sectionCls}>
        <h2 className="text-lg font-semibold text-white">Connectivity</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="bluetoothVersion" className={labelCls}>
              Bluetooth Version
            </label>
            <input
              id="bluetoothVersion"
              type="text"
              value={bluetoothVersion}
              onChange={(e) => setBluetoothVersion(e.target.value)}
              placeholder="5.3"
              className={inputCls}
            />
          </div>
          <div className="flex items-end gap-6">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={wifi}
                onChange={(e) => setWifi(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-violet-600 focus:ring-violet-500"
              />
              Wi-Fi
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={usbC}
                onChange={(e) => setUsbC(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-violet-600 focus:ring-violet-500"
              />
              USB-C
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={auxJack}
                onChange={(e) => setAuxJack(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-violet-600 focus:ring-violet-500"
              />
              3.5mm Aux
            </label>
          </div>
        </div>
      </div>

      {/* Battery */}
      <div className={sectionCls}>
        <h2 className="text-lg font-semibold text-white">
          Battery Information
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label htmlFor="batteryHours" className={labelCls}>
              Battery Life (hours)
            </label>
            <input
              id="batteryHours"
              type="number"
              value={batteryHours}
              onChange={(e) => setBatteryHours(e.target.value)}
              placeholder="30"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="chargingTime" className={labelCls}>
              Charging Time (minutes)
            </label>
            <input
              id="chargingTime"
              type="number"
              value={chargingTime}
              onChange={(e) => setChargingTime(e.target.value)}
              placeholder="180"
              className={inputCls}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={wirelessCharging}
                onChange={(e) => setWirelessCharging(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-violet-600 focus:ring-violet-500"
              />
              Wireless Charging
            </label>
          </div>
        </div>
      </div>

      {/* Compatibility */}
      <div className={sectionCls}>
        <h2 className="text-lg font-semibold text-white">Compatibility</h2>
        <div className="flex flex-wrap gap-3">
          {COMPATIBILITY_OPTIONS.map((opt) => (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                compatibility.includes(opt)
                  ? "border-violet-500 bg-violet-600/10 text-violet-300"
                  : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              <input
                type="checkbox"
                checked={compatibility.includes(opt)}
                onChange={() => toggleCompatibility(opt)}
                className="sr-only"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Variants */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Variants</h2>
          <button
            type="button"
            onClick={addVariant}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Variant
          </button>
        </div>

        <div className="space-y-4">
          {variants.map((variant, idx) => (
            <div
              key={variant.key}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">
                  Variant {idx + 1}
                </span>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.key)}
                    className="rounded p-1 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelCls}>Color</label>
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) =>
                      updateVariant(variant.key, "color", e.target.value)
                    }
                    placeholder="Midnight Black"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Color Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={variant.colorHex}
                      onChange={(e) =>
                        updateVariant(variant.key, "colorHex", e.target.value)
                      }
                      className="h-10 w-10 cursor-pointer rounded border border-zinc-700 bg-zinc-800"
                    />
                    <input
                      type="text"
                      value={variant.colorHex}
                      onChange={(e) =>
                        updateVariant(variant.key, "colorHex", e.target.value)
                      }
                      placeholder="#000000"
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Edition (optional)</label>
                  <input
                    type="text"
                    value={variant.edition}
                    onChange={(e) =>
                      updateVariant(variant.key, "edition", e.target.value)
                    }
                    placeholder="Limited Edition"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>SKU</label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) =>
                      updateVariant(variant.key, "sku", e.target.value)
                    }
                    placeholder="SONY-WH1000XM5-BLK"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariant(variant.key, "price", e.target.value)
                    }
                    placeholder="349.00"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Stock</label>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(variant.key, "stock", e.target.value)
                    }
                    placeholder="50"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className={sectionCls}>
        <h2 className="text-lg font-semibold text-white">Product Images</h2>
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 py-12">
          <div className="text-center">
            <Upload className="mx-auto h-10 w-10 text-zinc-600" />
            <p className="mt-3 text-sm text-zinc-400">
              Drag and drop images, or click to browse
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              PNG, JPG, WebP up to 5MB
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
            >
              Browse Files
            </button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Link
          href="/products"
          className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          <Save className="h-4 w-4" />
          Save Product
        </button>
      </div>
    </form>
  );
}
