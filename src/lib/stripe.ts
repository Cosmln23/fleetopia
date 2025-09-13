import Stripe from 'stripe';

// Make Stripe optional for deployment - can be configured later in production
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
    typescript: true,
  });
} else {
  console.warn('STRIPE_SECRET_KEY not set - Stripe features will be disabled');
}

export { stripe };