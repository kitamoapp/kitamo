
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// This is your secret key, which should be stored in environment variables.
// It is used to authenticate requests to the Stripe API.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: Request) {
  const { priceId } = await request.json();

  if (!priceId) {
    return NextResponse.json(
      { error: 'Price ID is required' },
      { status: 400 }
    );
  }

  try {
    // For a real application, you would also pass a `customer` ID
    // to associate the subscription with a logged-in user.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paymaya', 'grabpay', 'gcash'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      // IMPORTANT: Replace these with your actual success and cancel URLs.
      // These are the pages the user will be redirected to after checkout.
      success_url: `${request.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/subscriptions`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    console.error('Error creating Stripe Checkout session:', err);
    return NextResponse.json(
      { error: `Error creating checkout session: ${err.message}` },
      { status: 500 }
    );
  }
}
