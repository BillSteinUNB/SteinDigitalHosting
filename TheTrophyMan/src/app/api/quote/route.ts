// Quote API Route - Demo Version
// Returns success without sending emails for demo purposes

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, service, message } = body;

    // Validate required fields
    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Demo mode - just log and return success
    console.log('Quote request received (demo mode):', { name, email, service });

    return NextResponse.json({ 
      success: true, 
      message: 'Quote request received (demo mode - no email sent)' 
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
