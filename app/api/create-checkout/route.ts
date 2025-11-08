import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // For development purposes, if no Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('Stripe is not configured. Using dummy checkout URL.');
      return NextResponse.json({ 
        url: '/success?session_id=dummy_session_' + Date.now() 
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'SoloVault - Base Complète',
              description: '50+ projets solos détaillés + mises à jour mensuelles',
            },
            unit_amount: 1900, // 19.00 EUR en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}`,
      customer_email: email,
      metadata: {
        product: 'complete_database',
        version: '1.0'
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Stripe error:', error);
    // For development, return a dummy URL
    return NextResponse.json({ 
      url: '/success?session_id=dummy_session_' + Date.now() 
    });
  }
}
