import { Stripe } from "stripe";

const stripe = new Stripe(process.env.EXPO_PUBLIC_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payment_method_id, payment_intent_id, customer_id } = body;

    if (!payment_intent_id) {
      return new Response(
        JSON.stringify({ error: "Missing payment_intent_id" }),
        { status: 400 }
      );
    }

    try {
      let intent;
      if (payment_method_id) {
        // If this is a new payment method, attach it to the customer first
        const paymentMethod = await stripe.paymentMethods.attach(
          payment_method_id,
          { customer: customer_id }
        );

        // Update the payment intent with the new payment method
        intent = await stripe.paymentIntents.update(payment_intent_id, {
          payment_method: paymentMethod.id,
        });
      }

      // Confirm the payment intent
      intent = await stripe.paymentIntents.confirm(payment_intent_id);

      return new Response(
        JSON.stringify({
          success: true,
          status: intent.status,
          paymentIntent: intent,
        })
      );
    } catch (error: any) {
      console.error("Stripe API error:", error);
      return new Response(
        JSON.stringify({
          error: error.message || "Payment processing failed",
          code: error.code,
          decline_code: error.decline_code,
        }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("General payment error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
