import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, projectReference, message } = await request.json();

    // Validation
    if (!email || !projectReference || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For development purposes, log the quote request
    console.log('Quote request received:', {
      email,
      projectReference,
      message,
      date: new Date().toLocaleString('fr-FR')
    });

    // In production, you would send this via EmailJS here
    if (process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) {
      // EmailJS integration would go here
      console.log('Would send email via EmailJS');
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Quote request error:', error);
    return NextResponse.json(
      { error: 'Failed to send quote request' },
      { status: 500 }
    );
  }
}
