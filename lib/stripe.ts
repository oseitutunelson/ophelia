import Stripe from 'stripe';

export const STRIPE_PLANS = {
  individual: {
    priceId: process.env.STRIPE_INDIVIDUAL_PRICE_ID!,
    name: 'Individual Pro',
    amount: 259 // $2.59 in cents
  },
  agency: {
    priceId: process.env.STRIPE_AGENCY_PRICE_ID!,
    name: 'Agency Pro',
    amount: 959 // $9.59 in cents
  }
} as const;

// Lazy singleton — Stripe is NOT instantiated at import time.
// Next.js evaluates module-level code during build; instantiating Stripe
// there throws because STRIPE_SECRET_KEY is only available at runtime.
let _stripe: Stripe | undefined;

function getInstance(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-05-27.dahlia',
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    return (getInstance() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
