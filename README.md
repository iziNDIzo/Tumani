# Tumani - Voice Guardian

**Voice Guardian turns a driver's own voice into their fastest way to call for help.**

Built for the AssemblyAI Voice Agent Hackathon on lablab.ai.

## The problem
Tumani connects professional drivers across Malawi for trip-sharing, parcel delivery, and errands. Many drivers travel alone on unfamiliar roads. When a vehicle breaks down, getting help fast is hard, and typing on a phone under stress isn't realistic.

## What Voice Guardian does
- A driver taps **Breakdown** on a trip and speaks what's wrong.
- AssemblyAI transcribes the speech.
- An alert with the transcript and the driver's location is sent to mechanics.
- Mechanics see open alerts and can claim the job.

## Try it (demo access)
**Live app:** https://tumani.vercel.app

**Driver demo login**
- Email: tumani.demo.driver@outlook.com
- Password: demo2026

**How to test**
1. Open the live app and tap the red "New: drivers can now speak an SOS..." banner (or **Voice Guardian** in the menu).
2. Log in with the driver demo account.
3. On My trips, tap **Breakdown** on the trip, then **Start Recording**. Allow microphone and location when asked.
4. Describe a problem, for example "My car has a flat tyre near Kasungu", then tap **Stop Recording**.
5. Check the transcript and tap **Send Alert to Mechanics**.
6. **Mechanic side:** on the homepage, tap **Mechanic**. No login is needed. The alert appears there.

The demo accounts contain no real data.



## Built with
Next.js, React, TypeScript, Tailwind CSS, Supabase, Vercel, and AssemblyAI speech-to-text.

## Run locally
```bash
git clone [add your GitHub repo link]
cd tumani-parcels
npm install
```
Create a `.env.local` file with your Supabase project URL and key and your AssemblyAI API key (the variable names are used in `lib/supabaseClient.ts` and `app/api/transcribe`). Then run:
```bash
npm run dev
```

## What's next
- Mechanic sign-up, profiles, and a login-protected dashboard
- Paid driver subscriptions for Voice Guardian
- Alerts to other drivers on the same road
- SMS fallback for weak connectivity
- A guided voice SOS flow for accidents
- Local language support such as Chichewa
