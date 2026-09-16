import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Debug: check if env loaded
const apiKey = process.env.RESEND_API_KEY;
console.log("RESEND KEY STATUS:", apiKey? "Loaded ✅" : "MISSING ❌");
const resend = apiKey ? new Resend(apiKey) : null as any;

// Inside your POST function, add this check at the very top:
if (!apiKey || !resend) {
  console.log("RESEND KEY STATUS: MISSING - skipping email");
  return Response.json({ success: true, skipped: true });
}

export async function POST(request: Request) {
  try {
    const { email, trackingId, status, from, to } = await request.json();

    console.log("Sending email to:", email, "for parcel:", trackingId);

    const statusMessage = {
      'Accepted': 'has been accepted by our driver and will be picked up soon',
      'On Bus': 'is now on the bus and on its way',
      'Delivered': 'has been delivered successfully'
    }

    const { data, error } = await resend.emails.send({
      from: 'Tumani Parcels <onboarding@resend.dev>',
      to: [email],
      subject: `Update: Parcel ${trackingId} is now ${status}`,
      html: `<h2>Tumani Parcels Update</h2>
        <p>Your parcel <b>${trackingId}</b> from <b>${from}</b> to <b>${to}</b></p>
        <p>Status: <b>${status}</b> - ${statusMessage[status as keyof typeof statusMessage]}</p>
        <p>Track it anytime at tumani.co.mw/track</p>`
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    console.log("Email sent successfully:", data);
    return NextResponse.json({ success: true, data })

  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
