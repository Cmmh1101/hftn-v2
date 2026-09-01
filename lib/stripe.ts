import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/**
 * Lazily constructed so importing this module (e.g. during `next build`'s
 * route-collection pass) doesn't require STRIPE_SECRET_KEY to be set.
 */
export function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripeClient;
}
