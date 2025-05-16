import { stripe } from "@/lib/stripeServer";

export async function POST(req: Request) {
  const { amount } = await req.json();
  const costomers = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: costomers.id },
    { apiVersion: "2025-04-30.basil" }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount ? Math.floor(amount * 100) : 10000, // Amount in cents
    currency: "usd",
    customer: costomers.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return Response.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: costomers.id,
    publishableKey: process.env.EXPO_PUBLIC_PUBLISHABLE_KEY,
  });
}
