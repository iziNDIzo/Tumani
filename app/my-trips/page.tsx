"use client"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { supabase } from "../../lib/supabaseClient"

const fmtWhen = (x: string) =>
  new Date(x).toLocaleString([], { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })

const badge: Record<string, string> = {
  requested: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-600",
  completed: "bg-blue-100 text-blue-800",
}

const order: Record<string, number> = { requested: 0, confirmed: 1, completed: 2, declined: 3, cancelled: 4 }

function BreakdownButton({ tripId, driverId }: { tripId: string; driverId: string }) {
  const [open, setOpen] = useState(false)
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    setError("")
    setTranscript("")
    setSent(false)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []
    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data)
    mediaRecorder.onstop = handleStop
    mediaRecorder.start()
    setRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const handleStop = async () => {
    setLoading(true)
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
    const formData = new FormData()
    formData.append("audio", audioBlob, "recording.webm")

    const res = await fetch("/api/transcribe", { method: "POST", body: formData })
    const data = await res.json()
    setTranscript(data.text || data.error || "No transcript returned")
    setLoading(false)
  }

  const sendAlert = () => {
    setError("")
    if (!navigator.geolocation) {
      setError("Location not supported on this device")
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError("You must be logged in")
          return
        }
        const { error: insertError } = await supabase.from("breakdown_alerts").insert({
          driver_id: driverId,
          driver_name: user.email,
          trip_id: tripId,
          latitude,
          longitude,
          transcript,
          status: "open",
        })
        if (insertError) setError(insertError.message)
        else setSent(true)
      },
      (err) => setError("Could not get location: " + err.message)
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="h-[36px] px-4 rounded-full bg-red-600 text-white text-[12px] font-black"
      >
        🚨 Breakdown
      </button>
    )
  }

  return (
    <div className="mt-2 border border-red-200 bg-red-50 rounded-[14px] p-3">
      <p className="text-[12px] font-black mb-2">Report a breakdown</p>
      <button
        onClick={recording ? stopRecording : startRecording}
        className="h-[36px] px-4 rounded-full bg-black text-white text-[12px] font-black"
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      {loading && <p className="text-[12px] mt-2">Transcribing...</p>}
      {transcript && (
        <div className="mt-2">
          <p className="text-[12px]"><strong>You said:</strong> {transcript}</p>
          <button
            onClick={sendAlert}
            disabled={sent}
            className="mt-2 h-[36px] px-4 rounded-full bg-red-600 text-white text-[12px] font-black disabled:opacity-50"
          >
            {sent ? "Alert Sent ✅" : "Send Alert to Mechanics"}
          </button>
        </div>
      )}
      {error && <p className="text-[12px] text-red-600 mt-2">{error}</p>}
      <button onClick={() => setOpen(false)} className="block mt-2 text-[11px] underline opacity-60">
        Cancel
      </button>
    </div>
  )
}

export default function MyTrips() {
  const [access, setAccess] = useState<"checking" | "loggedOut" | "notApproved" | "ok">("checking")
  const [userId, setUserId] = useState<string | null>(null)
  const [trips, setTrips] = useState<any[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [msg, setMsg] = useState("")

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(""), 4000)
  }

  const load = async (uid: string) => {
    const { data, error } = await supabase
      .from("trips")
      .select("*, bookings(id, kind, seats, status, created_at, profiles(full_name, phone))")
      .eq("driver_id", uid)
      .order("depart_at", { ascending: true })
    if (error) flash("❌ " + error.message)
    setTrips(data || [])
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setAccess("loggedOut")
        return
      }
      setUserId(user.id)
      const { data: ok } = await supabase.rpc("is_approved_driver", { uid: user.id })
      if (ok !== true) {
        setAccess("notApproved")
        return
      }
      setAccess("ok")
      load(user.id)
    }
    init()
  }, [])

  const act = async (bookingId: string, action: string, doneMsg: string) => {
    setBusyId(bookingId)
    const { error } = await supabase.rpc("respond_to_booking", { p_booking: bookingId, p_action: action })
    setBusyId(null)
    if (error) {
      flash("❌ " + error.message)
      return
    }
    flash(doneMsg)
    if (userId) await load(userId)
  }

  const cancelBooking = (bookingId: string) => {
    if (window.confirm("Cancel this confirmed booking? The seat goes back on sale.")) {
      act(bookingId, "cancel", "Booking cancelled. Seat is available again.")
    }
  }

  const Shell = ({ children }: { children: any }) => (
    <div className="min-h-screen bg-[#fcfaf8] text-black">
      <header className="sticky top-0 z-50 bg-[#fcfaf8]/80 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-[720px] mx-auto px-4 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0a84ff] grid place-items-center text-white font-black">T</div>
            <span className="font-black text-[18px]">Tumani</span>
          </Link>
          <Link href="/marketplace" className="h-[40px] px-5 grid place-items-center rounded-full border-[1.5px] border-black font-black text-[13px]">
            Marketplace
          </Link>
        </div>
      </header>
      <main className="max-w-[720px] mx-auto px-4 py-8">{children}</main>
    </div>
  )

  if (access === "checking") return <Shell><p className="text-[13px] opacity-60">Loading...</p></Shell>

  if (access === "loggedOut") {
    return (
      <Shell>
        <div className="bg-white border border-black/10 rounded-[24px] p-8 text-center shadow-sm">
          <h1 className="font-black text-[24px]">Log in to see your trips</h1>
          <Link href="/login?next=/my-trips" className="mt-6 block h-[48px] leading-[48px] rounded-full bg-black text-white font-black text-[14px]">Log in</Link>
        </div>
      </Shell>
    )
  }

  if (access === "notApproved") {
    return (
      <Shell>
        <div className="bg-white border border-black/10 rounded-[24px] p-8 text-center shadow-sm">
          <h1 className="font-black text-[24px]">Verified drivers only</h1>
          <p className="mt-2 text-[13px] text-black/60">This page is for approved drivers.</p>
          <Link href="/apply-driver" className="mt-6 block h-[48px] leading-[48px] rounded-full bg-black text-white font-black text-[14px]">Apply / check status</Link>
        </div>
      </Shell>
    )
  }

  const now = Date.now()
  const upcoming = trips.filter(t => new Date(t.depart_at).getTime() >= now)
  const past = trips.filter(t => new Date(t.depart_at).getTime() < now).reverse()
  const waiting = trips.reduce(
    (n, t) => n + (t.bookings || []).filter((b: any) => b.status === "requested").length,
    0
  )

  const TripCard = ({ t }: { t: any }) => {
    const bookings = [...(t.bookings || [])].sort((a: any, b: any) => order[a.status] - order[b.status])
    return (
      <div className="bg-white border border-black/10 rounded-[20px] p-4">
        <div className="flex justify-between items-start gap-2">
          <div>
            <div className="font-black">{t.from_city} → {t.to_city}</div>
            <div className="text-[12px] opacity-60">{fmtWhen(t.depart_at)}</div>
          </div>
          <span className="bg-[#f5f3ff] rounded-full px-3 py-1 text-[10px] font-black uppercase">{t.status}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-black">
          {t.seats_total > 0 && <span className="bg-[#f5f3ff] rounded-full px-3 py-1">💺 {t.seats_available}/{t.seats_total} seats left</span>}
          {t.parcel_slots_total > 0 && <span className="bg-[#f5f3ff] rounded-full px-3 py-1">📦 {t.parcel_slots_available}/{t.parcel_slots_total} slots</span>}
        </div>

        <div className="mt-3">
          <BreakdownButton tripId={t.id} driverId={t.driver_id} />
        </div>

        <div className="mt-3 space-y-2">
          {bookings.length === 0 && <p className="text-[12px] opacity-50">No requests yet.</p>}
          {bookings.map((b: any) => (
            <div key={b.id} className="border border-black/10 rounded-[14px] p-3">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <div className="font-black text-[13px] truncate">
                    {b.profiles?.full_name || "Customer"} • {b.kind === "seat" ? `${b.seats} seat${b.seats > 1 ? "s" : ""}` : "parcel"}
                  </div>
                  <div className="text-[12px] opacity-60">
                    {b.profiles?.phone ? <a href={`tel:${b.profiles.phone}`} className="underline">{b.profiles.phone}</a> : "No phone number on file"}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${badge[b.status] || ""}`}>{b.status}</span>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {b.status === "requested" && (
                  <>
                    <button disabled={busyId === b.id} onClick={() => act(b.id, "confirm", "✅ Booking confirmed.")} className="h-[36px] px-4 rounded-full bg-black text-white text-[12px] font-black disabled:opacity-50">
                      Confirm
                    </button>
                    <button disabled={busyId === b.id} onClick={() => act(b.id, "decline", "Request declined.")} className="h-[36px] px-4 rounded-full border border-black/20 text-[12px] font-black disabled:opacity-50">
                      Decline
                    </button>
                  </>
                )}
                {b.status === "confirmed" && (
                  <>
                    <button disabled={busyId === b.id} onClick={() => act(b.id, "complete", "✅ Marked as completed.")} className="h-[36px] px-4 rounded-full bg-[#0a84ff] text-white text-[12px] font-black disabled:opacity-50">
                      Mark completed
                    </button>
                    <button disabled={busyId === b.id} onClick={() => cancelBooking(b.id)} className="h-[36px] px-4 rounded-full border border-black/20 text-[12px] font-black disabled:opacity-50">
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Shell>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-black text-[32px] tracking-tight leading-[0.9]">My trips</h1>
        <Link href="/post" className="h-[40px] px-5 grid place-items-center rounded-full bg-black text-white font-black text-[13px]">Post a trip</Link>
      </div>
      <p className="mt-2 text-[13px] text-black/60">
        {waiting > 0 ? `${waiting} request${waiting > 1 ? "s" : ""} waiting for you` : "No requests waiting"}
      </p>

      {msg && <div className="mt-4 bg-black text-white text-[13px] font-black text-center py-2 rounded-full">{msg}</div>}

      <h2 className="mt-8 text-[11px] font-black tracking-widest">UPCOMING</h2>
      <div className="mt-3 space-y-3">
        {upcoming.length === 0 && <p className="text-[13px] opacity-60">No upcoming trips. Post one and customers can start requesting seats.</p>}
        {upcoming.map(t => <TripCard key={t.id} t={t} />)}
      </div>

      {past.length > 0 && (
        <>
          <h2 className="mt-8 text-[11px] font-black tracking-widest">PAST</h2>
          <div className="mt-3 space-y-3">
            {past.map(t => <TripCard key={t.id} t={t} />)}
          </div>
        </>
      )}
    </Shell>
  )
}