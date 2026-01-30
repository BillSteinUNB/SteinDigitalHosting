// Quote API Route
// Handles form submissions and sends emails via Resend

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message, attachments } = body;

    // Validate required fields
    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'The Trophy Man <quotes@trophyman.ca>',
      to: process.env.QUOTE_EMAIL || 'nick@trophyman.ca',
      replyTo: email,
      subject: `New Quote Request: ${service}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #D4AF37; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #666; }
            .value { margin-top: 5px; }
            .attachments { background: #f5f5f5; padding: 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>New Quote Request</h1>
            
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${email}</div>
            </div>
            
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${phone || 'Not provided'}</div>
            </div>
            
            <div class="field">
              <div class="label">Service:</div>
              <div class="value">${service}</div>
            </div>
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
            
            ${attachments && attachments.length > 0 ? `
            <div class="field">
              <div class="label">Attachments:</div>
              <div class="attachments">
                <ul>
                  ${attachments.map((url: string) => `
                    <li><a href="${url}" target="_blank">${url.split('/').pop()}</a></li>
                  `).join('')}
                </ul>
              </div>
            </div>
            ` : ''}
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
