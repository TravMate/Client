import { Stripe } from "stripe";

const stripe = new Stripe(process.env.EXPO_PUBLIC_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, amount } = body;

    if (!name || !email || !amount) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details: { name, email, amount },
        }),
        { status: 400 }
      );
    }

    let customer;
    try {
      const doesCustomerExist = await stripe.customers.list({ email });
      customer =
        doesCustomerExist.data.length > 0
          ? doesCustomerExist.data[0]
          : await stripe.customers.create({ name, email });
    } catch (error) {
      console.error("Error creating/finding customer:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to create/find customer",
          details: error,
        }),
        { status: 500 }
      );
    }

    try {
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: "2025-04-30.basil" }
      );

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Ensure amount is rounded to avoid decimal issues
        currency: "usd",
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });

      return new Response(
        JSON.stringify({
          paymentIntent: paymentIntent,
          ephemeralKey: ephemeralKey,
          customer: customer.id,
          publishableKey: process.env.EXPO_PUBLIC_PUBLISHABLE_KEY,
        })
      );
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to create payment intent",
          details: error,
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("General payment error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error,
      }),
      { status: 500 }
    );
  }
}
