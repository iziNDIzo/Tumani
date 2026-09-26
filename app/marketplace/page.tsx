"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import Link from "next/link"

const CITIES = ["Lilongwe", "Blantyre", "Mzuzu", "Salima", "Mangochi", "Zomba", "Dedza", "Kasungu"]

const fmtWhen = (x: string) =>
  new Date(x).toLocaleString([], { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })

export default function Marketplace() {
  const [trips, setTrips] = useState<any[]>([])
  const [ratings, setRatings] = useState<Record<string, { avg: number; count: number }>>({})
  const [requested, setRequested] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)
  const [msg, setMsg] = useState("")

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(""), 4000)
  }

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      // The database only returns trips from approved drivers, so no extra filtering is needed here.
      const { data } = await supabase
        .from("trips")
        .select("*, driver_profiles(display_name, photo_path, vehicle_type, vehicle_make, vehicle_model, vehicle_color, plate_number)")
        .eq("status", "open")
        .gte("depart_at", new Date().toISOString())
        .order("depart_at", { ascending: true })
      const list = data || []
      setTrips(list)

      const ids = Array.from(new Set(list.map((t: any) => t.driver_id)))
      if (ids.length > 0) {
        const { data: rv } = await supabase.from("reviews").select("driver_id, rating").in("driver_id", ids)
        const sums: Record<string, { total: number; count: number }> = {}
        for (const r of rv || []) {
          sums[r.driver_id] = sums[r.driver_id] || { total: 0, count: 0 }
          sums[r.driver_id].total += r.rating
          sums[r.driver_id].count += 1
        }
        const out: Record<string, { avg: number; count: number }> = {}
        for (const id of Object.keys(sums)) out[id] = { avg: sums[id].total / sums[id].count, count: sums[id].count }
        setRatings(out)
      }

      if (user) {
        const { data: bk } = await supabase
          .from("bookings")
          .select("trip_id, status")
          .eq("customer_id", user.id)
          .in("status", ["requested", "confirmed"])
        setRequested((bk || []).map((b: any) => b.trip_id))
      }
      setLoading(false)
    }
    load()
  }, [])

  const requestSeat = async (t: any) => {
    if (!userId) {
      window.location.href = "/login?next=/marketplace"
      return
    }
    setBusyId(t.id)
    const { error } = await supabase
      .from("bookings")
      .insert({ trip_id: t.id, customer_id: userId, kind: "seat", seats: 1 })
    setBusyId(null)
    if (error) {
      flash("❌ " + error.message)
      return
    }
    setRequested([...requested, t.id])
    flash("✅ Seat requested. The driver will confirm it.")
  }

  const avatarUrl = (path: string | null) =>
    path ? supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl : null

  const shown = trips.filter(t => (!from || t.from_city === from) && (!to || t.to_city === to))

  const selectCls = "h-[42px] bg-[#f5f3ff] rounded-full px-4 font-bold text-[13px] outline-none"

  return (
    <main className="max-w-[720px] mx-auto p-4 pb-20">
      <a href="/" className="inline-block mb-4 text-[13px] font-bold opacity-60">← Back to Home</a>
      <h1 className="text-[24px] font-black">Tumani Marketplace</h1>
      <p className="text-[13px] opacity-60">
        {loading ? "Loading trips..." : `${shown.length} upcoming ${shown.length === 1 ? "trip" : "trips"}`} • Verified drivers only
      </p>

      {msg && <div className="mt-4 bg-black text-white text-[13px] font-black text-center py-2 rounded-full">{msg}</div>}

      <div className="mt-5 flex flex-wrap gap-2">
        <select value={from} onChange={e => setFrom(e.target.value)} className={selectCls}>
          <option value="">From: anywhere</option>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={to} onChange={e => setTo(e.target.value)} className={selectCls}>
          <option value="">To: anywhere</option>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <Link href="/post" className="h-[42px] px-5 grid place-items-center rounded-full border-[1.5px] border-black font-black text-[13px]">
          Post a trip
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {!loading && shown.length === 0 && (
          <p className="text-[13px] opacity-60">No trips match. Try another route, or check back soon.</p>
        )}

        {shown.map(t => {
          const p = t.driver_profiles
          const r = ratings[t.driver_id]
          const photo = avatarUrl(p?.photo_path ?? null)
          const mine = t.driver_id === userId
          const already = requested.includes(t.id)
          const full = t.seats_available <= 0

          return (
            <div key={t.id} className="bg-white border border-black/10 rounded-[20px] p-4">
              <div className="flex items-center gap-2">
                {photo ? (
                  <img src={photo} alt="" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 bg-[#0a84ff] text-white rounded-full grid place-items-center font-black text-[13px]">
                    {(p?.display_name || "?")[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-black text-[14px] truncate">{p?.display_name || "Driver"} ✓</div>
                  <div className="text-[11px] opacity-60 truncate">
                    {[p?.vehicle_color, p?.vehicle_make, p?.vehicle_model].filter(Boolean).join(" ") || p?.vehicle_type}
                    {p?.plate_number ? ` • ${p.plate_number}` : ""}
                  </div>
                </div>
                <span className="ml-auto bg-[#0a84ff] text-white px-2 py-0.5 rounded-full text-[10px] font-black whitespace-nowrap">
                  {r ? `⭐ ${r.avg.toFixed(1)} (${r.count})` : "New"}
                </span>
              </div>

              <div className="mt-3 font-black">{t.from_city} → {t.to_city}</div>
              {t.stops?.length > 0 && <div className="text-[12px] opacity-60">via {t.stops.join(", ")}</div>}
              <div className="text-[12px] opacity-60">{fmtWhen(t.depart_at)}</div>

              <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-black">
                {t.seats_total > 0 && (
                  <span className="bg-[#f5f3ff] rounded-full px-3 py-1">
                    💺 {t.seats_available} left{t.seat_price_mwk != null ? ` • MK ${t.seat_price_mwk.toLocaleString()}` : ""}
                  </span>
                )}
                {t.parcel_slots_total > 0 && (
                  <span className="bg-[#f5f3ff] rounded-full px-3 py-1">
                    📦 {t.parcel_slots_available} slots{t.parcel_fee_mwk != null ? ` • MK ${t.parcel_fee_mwk.toLocaleString()}` : ""}
                  </span>
                )}
              </div>
              {t.notes && <p className="mt-2 text-[12px] opacity-70">{t.notes}</p>}

              <div className="mt-3 flex gap-2">
                <Link href={`/driver/${t.driver_id}`} className="h-[40px] px-5 grid place-items-center rounded-full border border-black/20 text-[12px] font-black">
                  Driver profile
                </Link>
                {t.seats_total > 0 && (
                  mine ? (
                    <span className="h-[40px] px-5 grid place-items-center text-[12px] font-black opacity-50">Your trip</span>
                  ) : (
                    <button
                      onClick={() => requestSeat(t)}
                      disabled={already || full || busyId === t.id}
                      className="h-[40px] px-5 rounded-full bg-[#0a84ff] text-white text-[12px] font-black disabled:opacity-50"
                    >
                      {already ? "Requested ✓" : full ? "Full" : busyId === t.id ? "Requesting..." : "Request a seat"}
                    </button>
                  )
                )}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}