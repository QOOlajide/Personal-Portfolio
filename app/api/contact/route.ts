import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\d\s\-+()]{7,20}$/;
  return phoneRegex.test(phone);
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, message } = body;

    // Validation
    const errors: string[] = [];

    if (!name || name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }

    if (!email || !validateEmail(email)) {
      errors.push("Please provide a valid email address");
    }

    if (phone && !validatePhone(phone)) {
      errors.push("Please provide a valid phone number");
    }

    if (!message || message.trim().length < 10) {
      errors.push("Message must be at least 10 characters");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Check environment variables
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!toEmail || !fromEmail) {
      console.error("Missing email configuration");
      return NextResponse.json(
        { success: false, errors: ["Server configuration error"] },
        { status: 500 }
      );
    }

    // Send email via Resend
    const timestamp = new Date().toISOString();

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Portfolio Contact: ${name.trim()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #18181b; border-bottom: 1px solid #e4e4e7; padding-bottom: 12px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 24px 0;">
            <p style="margin: 8px 0; color: #52525b;">
              <strong style="color: #18181b;">Name:</strong> ${name.trim()}
            </p>
            <p style="margin: 8px 0; color: #52525b;">
              <strong style="color: #18181b;">Email:</strong> 
              <a href="mailto:${email.trim()}" style="color: #3b82f6;">${email.trim()}</a>
            </p>
            ${phone ? `
            <p style="margin: 8px 0; color: #52525b;">
              <strong style="color: #18181b;">Phone:</strong> ${phone.trim()}
            </p>
            ` : ""}
            <p style="margin: 8px 0; color: #52525b;">
              <strong style="color: #18181b;">Submitted:</strong> ${timestamp}
            </p>
          </div>
          
          <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px; margin-top: 24px;">
            <p style="margin: 0 0 8px 0; color: #18181b; font-weight: 600;">Message:</p>
            <p style="margin: 0; color: #52525b; white-space: pre-wrap;">${message.trim()}</p>
          </div>
          
          <p style="margin-top: 32px; font-size: 12px; color: #71717a;">
            Sent from Deen Dynamics Portfolio
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { success: false, errors: ["Failed to send email. Please try again."] },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, errors: ["An unexpected error occurred"] },
      { status: 500 }
    );
  }
}
