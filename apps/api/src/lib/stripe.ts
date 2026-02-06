import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getStripeInstance(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required");
    }
    _stripe = new Stripe(key, {
      apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
      typescript: true,
    });
  }
  return _stripe;
}

/**
 * Lazily-initialized Stripe client.
 * Throws on first access if STRIPE_SECRET_KEY is not set,
 * but does NOT crash the server at import time.
 */
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getStripeInstance();
    const value = (instance as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return (value as Function).bind(instance);
    }
    return value;
  },
});

export default stripe;
