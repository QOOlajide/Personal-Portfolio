# Resend — Env Vars Contract (V1)

We will send contact form submissions using Resend.

Destination inbox:
- quamola@gmail.com

Environment variables required:
- RESEND_API_KEY = (your Resend API key)
- CONTACT_TO_EMAIL = quamola@gmail.com
- CONTACT_FROM_EMAIL = a verified sender on Resend (must be verified in Resend dashboard)

Rules:
- Never expose RESEND_API_KEY to the client
- Email send must happen server-side only in /api/contact
- Do not log RESEND_API_KEY
- If CONTACT_FROM_EMAIL is not verified, email sending will fail (must be verified)

Expected behavior:
- On successful submit, send email to CONTACT_TO_EMAIL containing:
  - full name
  - email
  - phone
  - message
  - timestamp
- Return success JSON to frontend
