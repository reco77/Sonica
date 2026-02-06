import { MeiliSearch } from "meilisearch";

const MEILI_HOST = process.env.MEILI_HOST || "http://localhost:7700";
const MEILI_API_KEY = process.env.MEILI_API_KEY || "";

export const meili = new MeiliSearch({
  host: MEILI_HOST,
  apiKey: MEILI_API_KEY,
});

export const PRODUCTS_INDEX = "products";

/**
 * Configure the products index with filterable and sortable attributes.
 * Called once during startup or when re-indexing.
 */
export async function configureProductsIndex(): Promise<void> {
  const index = meili.index(PRODUCTS_INDEX);

  await index.updateFilterableAttributes([
    "category",
    "brand",
    "price",
    "compatibility",
    "connectivity",
    "featured",
    "active",
    "averageRating",
    "hasNoiseCancellation",
    "hasWirelessCharging",
    "isWaterResistant",
  ]);

  await index.updateSortableAttributes([
    "price",
    "averageRating",
    "reviewCount",
    "releaseDate",
    "name",
  ]);

  await index.updateSearchableAttributes([
    "name",
    "brand",
    "tagline",
    "description",
    "category",
  ]);
}

export default meili;
