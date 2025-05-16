import Stripe from "stripe";

export const stripe = new Stripe(process.env.EXPO_PUBLIC_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
  appInfo: {
    name: "Travmate",
  },
});
