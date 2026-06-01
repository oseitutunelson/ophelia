import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true
});

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
