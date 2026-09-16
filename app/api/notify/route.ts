import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

export async function POST(request: Request) {
  if (!apiKey || !resend) {
    console.log("RESEND KEY STATUS: MISSING - skipping email");
    return Response.json({ success: true, skipped: true });
  }

  try {
    const body = await request.json();
    // your existing email logic here
    await resend.emails.send({
      from: "Tumani <onboarding@resend.dev>",
      to: "your-email@gmail.com",
      subject: "New Tumani notification",
      html: `<p>${JSON.stringify(body)}</p>`,
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 });
  }
}
