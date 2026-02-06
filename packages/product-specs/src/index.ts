import type {
  ProductCategory,
  HeadphoneSpecs,
  SmartwatchSpecs,
  EarbudsSpecs,
  SpeakerSpecs,
} from "@sonica/shared";

// ---------------------------------------------------------------------------
// Spec Field Definition
// ---------------------------------------------------------------------------

export interface SpecFieldDefinition<T = unknown> {
  key: keyof T & string;
  label: string;
  unit?: string;
  format: (value: unknown) => string;
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

const identity = (v: unknown): string => String(v ?? "—");

const booleanYesNo = (v: unknown): string => (v ? "Yes" : "No");

const listJoin = (v: unknown): string =>
  Array.isArray(v) ? v.join(", ") : String(v ?? "—");

const frequencyRange = (v: unknown): string => {
  if (v && typeof v === "object" && "min" in v && "max" in v) {
    const range = v as { min: number; max: number };
    return `${range.min} – ${range.max}`;
  }
  return "—";
};

// ---------------------------------------------------------------------------
// Headphone Spec Fields
// ---------------------------------------------------------------------------

const headphoneFields: SpecFieldDefinition<HeadphoneSpecs>[] = [
  {
    key: "driverSize",
    label: "Driver Size",
    unit: "mm",
    format: identity,
  },
  {
    key: "frequencyRange",
    label: "Frequency Response",
    unit: "Hz",
    format: frequencyRange,
  },
  {
    key: "impedance",
    label: "Impedance",
    unit: "\u03A9",
    format: identity,
  },
  {
    key: "sensitivity",
    label: "Sensitivity",
    unit: "dB",
    format: identity,
  },
  {
    key: "noiseCancellation",
    label: "Active Noise Cancellation",
    format: booleanYesNo,
  },
  {
    key: "codecs",
    label: "Supported Codecs",
    format: listJoin,
  },
  {
    key: "cableLength",
    label: "Cable Length",
    unit: "m",
    format: (v) => (v != null ? String(v) : "N/A"),
  },
];

// ---------------------------------------------------------------------------
// Smartwatch Spec Fields
// ---------------------------------------------------------------------------

const smartwatchFields: SpecFieldDefinition<SmartwatchSpecs>[] = [
  {
    key: "displaySize",
    label: "Display Size",
    unit: "\"",
    format: identity,
  },
  {
    key: "displayType",
    label: "Display Type",
    format: identity,
  },
  {
    key: "os",
    label: "Operating System",
    format: identity,
  },
  {
    key: "sensors",
    label: "Sensors",
    format: listJoin,
  },
  {
    key: "gps",
    label: "GPS",
    format: booleanYesNo,
  },
  {
    key: "waterRating",
    label: "Water Resistance",
    format: identity,
  },
  {
    key: "strapWidth",
    label: "Strap Width",
    unit: "mm",
    format: identity,
  },
];

// ---------------------------------------------------------------------------
// Earbuds Spec Fields
// ---------------------------------------------------------------------------

const earbudsFields: SpecFieldDefinition<EarbudsSpecs>[] = [
  {
    key: "driverSize",
    label: "Driver Size",
    unit: "mm",
    format: identity,
  },
  {
    key: "ancLevel",
    label: "ANC Level",
    format: (v) => {
      switch (v) {
        case "none":
          return "None";
        case "basic":
          return "Basic";
        case "advanced":
          return "Advanced";
        default:
          return String(v ?? "—");
      }
    },
  },
  {
    key: "transparencyMode",
    label: "Transparency Mode",
    format: booleanYesNo,
  },
  {
    key: "stemDesign",
    label: "Design",
    format: (v) => {
      switch (v) {
        case "stem":
          return "Stem";
        case "stemless":
          return "Stemless";
        default:
          return String(v ?? "—");
      }
    },
  },
];

// ---------------------------------------------------------------------------
// Speaker Spec Fields
// ---------------------------------------------------------------------------

const speakerFields: SpecFieldDefinition<SpeakerSpecs>[] = [
  {
    key: "wattage",
    label: "Output Power",
    unit: "W",
    format: identity,
  },
  {
    key: "driverCount",
    label: "Driver Count",
    format: identity,
  },
  {
    key: "batteryLife",
    label: "Battery Life",
    unit: "hrs",
    format: identity,
  },
  {
    key: "waterRating",
    label: "Water Resistance",
    format: identity,
  },
];

// ---------------------------------------------------------------------------
// Category -> Fields Map
// ---------------------------------------------------------------------------

const specFieldsByCategory: Record<
  Exclude<ProductCategory, "accessory">,
  SpecFieldDefinition<any>[]
> = {
  headphones: headphoneFields,
  smartwatch: smartwatchFields,
  earbuds: earbudsFields,
  speaker: speakerFields,
};

/**
 * Returns the spec field definitions for a given product category.
 * Returns an empty array for "accessory" since accessories have no
 * standardised spec shape.
 */
export function getSpecFields(
  category: ProductCategory,
): SpecFieldDefinition<any>[] {
  if (category === "accessory") return [];
  return specFieldsByCategory[category] ?? [];
}
