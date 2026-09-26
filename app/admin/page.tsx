"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"

type Tab = "drivers" | "trips" | "bookings"
type Filter = "pending" | "approved" | "rejected" | "suspended" | "all"

const FILTERS: Filter[] = ["pending", "approved", "rejected", "suspended", "all"]

const DOC_LABELS: [string, string][] = [
  ["national_id_front_path", "National ID front"],
  ["national_id_back_path", "National ID back"],
  ["selfie_path", "Selfie holding ID"],
  ["license_path", "Driving licence"],
]

const badge: Record<string, string> = {
  pending: "bg-amber-400 text-black",
  approved: "bg-green-400 text-black",
  rejected: "bg-red-400 text-black",
  suspended: "bg-gray-400 text-black",
}

const fmt = (x: string) => (x ? new Date(x).toLocaleString() : "")

export default function AdminDashboard() {
  const [access, setAccess] = useState<"checking" | "denied" | "ok">("checking")
  const [adminId, setAdminId] = useState<string | null>(null)

  const [tab, setTab] = useState<Tab>("drivers")
  const [filter, setFilter] = useState<Filter>("pending")
  const [drivers, setDrivers] = useState<any[]>([])
  const [trips, setTrips] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [msg, setMsg] = useState("")
  const [busy, setBusy] = useState(false)

  const [docsFor, setDocsFor] = useState<any | null>(null)
  const [docUrls, setDocUrls] = useState<Record<string, string>>({})
  const [docsLoading, setDocsLoading] = useState(false)
  const [rejectFor, setRejectFor] = useState<any | null>(null)
  const [reason, setReason] = useState("")

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(""), 4000)
  }

  const load = async () => {
    const [d, p, t, b] = await Promise.all([
      supabase.from("drivers").select("*").order("created_at", { ascending: false }),
      supabase.from("driver_profiles").select("*"),
      supabase.from("trips").select("*, driver_profiles(display_name)").order("depart_at", { ascending: false }),
      supabase
        .from("bookings")
        .select("*, trips(from_city,to_city,depart_at), profiles(full_name,phone)")
        .order("created_at", { ascending: false }),
    ])
    const profiles: Record<string, any> = {}
    for (const x of p.data || []) profiles[x.user_id] = x
    setDrivers((d.data || []).map((x: any) => ({ ...x, profile: profiles[x.user_id] || null })))
    setTrips(t.data || [])
    setBookings(b.data || [])
  }

  // Only real admins get in. Everyone else sees "Admins only".
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setAccess("denied")
        return
      }
      const { data: ok } = await supabase.rpc("is_admin")
      if (ok !== true) {
        setAccess("denied")
        return
      }
      setAdminId(user.id)
      setAccess("ok")
      load()
    }
    init()
  }, [])

  const setStatus = async (d: any, status: string, why?: string) => {
    setBusy(true)
    const { data, error } = await supabase
      .from("drivers")
      .update({
        status,
        rejection_reason: status === "rejected" ? why || null : null,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", d.id)
      .select("id")
    setBusy(false)
    if (error || !data || data.length === 0) {
      flash("❌ Could not update: " + (error?.message || "not allowed"))
      return
    }
    flash(status === "approved" ? "✅ Driver approved. Their profile is now public." : `Driver marked ${status}.`)
    setDocsFor(null)
    setRejectFor(null)
    setReason("")
    await load()
  }

  // Documents are private: we make short-lived links (5 minutes) only when you open a review.
  const openDocs = async (d: any) => {
    setDocsFor(d)
    setDocUrls({})
    setDocsLoading(true)
    const entries = DOC_LABELS.filter(([k]) => d[k])
    const { data, error } = await supabase.storage
      .from("driver-docs")
      .createSignedUrls(entries.map(([k]) => d[k]), 300)
    if (error) {
      flash("❌ Could not load documents: " + error.message)
    } else {
      const urls: Record<string, string> = {}
      entries.forEach(([k], i) => {
        const u = data?.[i]?.signedUrl
        if (u) urls[k] = u
      })
      setDocUrls(urls)
    }
    setDocsLoading(false)
  }

  const suspend = (d: any) => {
    if (window.confirm(`Suspend ${d.full_name}? Their profile and trips will be hidden.`)) setStatus(d, "suspended")
  }

  const shown = drivers.filter(d => filter === "all" || d.status === filter)
  const pendingCount = drivers.filter(d => d.status === "pending").length
  const liveCount = drivers.filter(d => d.status === "approved").length

  if (access === "checking") {
    return <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center text-white/60">Loading...</div>
  }

  if (access === "denied") {
    return (
      <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center p-6">
        <div className="bg-[#1c202a] border border-white/10 rounded-[24px] p-8 max-w-[380px] w-full text-center">
          <div className="text-[28px]">🔒</div>
          <h1 className="font-black text-[20px] mt-3">Admins only</h1>
          <p className="text-[13px] text-white/50 mt-2">Log in with an admin account to open this page.</p>
          <a href="/login?next=/admin" className="mt-6 block h-[44px] leading-[44px] bg-[#0a84ff] rounded-full font-black text-[13px]">Log in</a>
          <a href="/" className="mt-2 block h-[44px] leading-[44px] bg-white/10 rounded-full font-black text-[13px]">Go home</a>
        </div>
      </div>
    )
  }

  const tabBtn = (t: Tab, label: string) => (
    <button
      onClick={() => setTab(t)}
      className={`w-full text-left rounded-xl px-4 py-3 font-black text-[13px] ${tab === t ? "bg-white text-black" : "text-white/40"}`}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex">
      <div className="hidden md:flex w-[260px] bg-[#171a21] border-r border-white/10 flex-col p-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#0a84ff] rounded-full flex items-center justify-center font-black">T</div>
          <span className="font-black text-[18px]">Tumani Admin</span>
        </div>
        <div className="mt-8 space-y-1">
          {tabBtn("drivers", `Drivers${pendingCount > 0 ? ` (${pendingCount} pending)` : ""}`)}
          {tabBtn("trips", `Trips (${trips.length})`)}
          {tabBtn("bookings", `Bookings (${bookings.length})`)}
        </div>
        <div className="mt-auto pt-6 border-t border-white/10">
          <p className="font-bold text-green-400">{liveCount} LIVE DRIVERS</p>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {msg && <div className="bg-[#0a84ff] text-white font-black text-center py-2 text-[13px]">{msg}</div>}

        {/* phone-friendly tab bar */}
        <div className="md:hidden flex gap-2 p-3 bg-[#171a21] border-b border-white/10 overflow-x-auto">
          {(["drivers", "trips", "bookings"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-[12px] font-black capitalize ${tab === t ? "bg-white text-black" : "bg-white/10"}`}>
              {t}{t === "drivers" && pendingCount > 0 ? ` (${pendingCount})` : ""}
            </button>
          ))}
        </div>

        {tab === "drivers" && (
          <>
            <div className="min-h-[64px] bg-[#171a21] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 px-6 py-3">
              <h1 className="font-black text-[18px]">Drivers • {shown.length}</h1>
              <div className="flex flex-wrap gap-2">
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-[12px] font-black capitalize ${filter === f ? "bg-white text-black" : "bg-white/10"}`}>
                    {f}
                  </button>
                ))}
                <button onClick={load} className="px-4 py-2 rounded-full bg-white/10 text-[12px] font-black">Refresh</button>
              </div>
            </div>
            <div className="px-6 py-6 space-y-3">
              {shown.length === 0 && <p className="text-white/40">No drivers in this list.</p>}
              {shown.map(d => (
                <div key={d.id} className="bg-[#1c202a] border border-white/10 rounded-2xl p-5 flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <p className="font-black">
                      {d.full_name}
                      {d.profile ? ` • ${d.profile.vehicle_make || ""} ${d.profile.vehicle_model || ""} ${d.profile.plate_number || ""}` : ""}
                    </p>
                    <p className="text-[13px] text-white/50">{d.phone} • applied {fmt(d.created_at)}</p>
                    <span className={`mt-2 inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${badge[d.status] || "bg-white/20"}`}>
                      {d.status}
                    </span>
                  </div>
                  <button onClick={() => openDocs(d)} className="bg-[#0a84ff] px-6 py-2.5 rounded-full text-[12px] font-black">
                    Review
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "trips" && (
          <div className="px-6 py-6 space-y-3">
            <h1 className="font-black mb-2">Trips • {trips.length}</h1>
            {trips.length === 0 && <p className="text-white/40">No trips yet.</p>}
            {trips.map(t => (
              <div key={t.id} className="bg-[#1c202a] border border-white/10 rounded-xl p-4 text-[13px]">
                <p className="font-black">{t.from_city} → {t.to_city} • {t.status}</p>
                <p className="text-white/50">
                  {t.driver_profiles?.display_name || "Driver"} • {fmt(t.depart_at)} • seats {t.seats_available}/{t.seats_total} • parcel slots {t.parcel_slots_available}/{t.parcel_slots_total}
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === "bookings" && (
          <div className="px-6 py-6 space-y-3">
            <h1 className="font-black mb-2">Bookings • {bookings.length}</h1>
            {bookings.length === 0 && <p className="text-white/40">No bookings yet.</p>}
            {bookings.map(b => (
              <div key={b.id} className="bg-[#1c202a] border border-white/10 rounded-xl p-4 text-[13px]">
                <p className="font-black">
                  {b.profiles?.full_name || "Customer"} • {b.kind} • {b.status}
                </p>
                <p className="text-white/50">
                  {b.trips ? `${b.trips.from_city} → ${b.trips.to_city} • ${fmt(b.trips.depart_at)}` : ""} • {b.profiles?.phone || ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review modal: details, documents, and every action */}
      {docsFor && (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#1c202a] border border-white/10 rounded-[24px] p-6 max-w-[720px] w-full my-6">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-black text-[20px]">{docsFor.full_name}</h3>
                <span className={`mt-1 inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${badge[docsFor.status] || "bg-white/20"}`}>
                  {docsFor.status}
                </span>
              </div>
              <button onClick={() => setDocsFor(null)} className="bg-white/10 w-9 h-9 rounded-full font-black">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5 text-[13px]">
              <div><p className="text-white/40 text-[11px] font-bold">PHONE</p>{docsFor.phone}</div>
              <div><p className="text-white/40 text-[11px] font-bold">NATIONAL ID NUMBER</p>{docsFor.national_id_number}</div>
              <div><p className="text-white/40 text-[11px] font-bold">LICENCE NUMBER</p>{docsFor.license_number}</div>
              <div>
                <p className="text-white/40 text-[11px] font-bold">VEHICLE</p>
                {docsFor.profile
                  ? `${docsFor.profile.vehicle_type} • ${docsFor.profile.vehicle_make || ""} ${docsFor.profile.vehicle_model || ""} • ${docsFor.profile.vehicle_color || ""} • ${docsFor.profile.plate_number} • ${docsFor.profile.seats} seats`
                  : "No profile"}
              </div>
              {docsFor.profile && (
                <div className="col-span-2">
                  <p className="text-white/40 text-[11px] font-bold">OFFERS</p>
                  {(docsFor.profile.services || []).join(", ")}
                </div>
              )}
              {docsFor.rejection_reason && (
                <div className="col-span-2">
                  <p className="text-white/40 text-[11px] font-bold">REJECTION REASON</p>
                  {docsFor.rejection_reason}
                </div>
              )}
            </div>

            <p className="text-[11px] text-white/40 mt-5">
              Check: the name and number match the National ID, the selfie shows the same person holding it, and the licence is valid.
              Links expire after 5 minutes.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-3">
              {docsLoading && <p className="text-white/50 col-span-2">Loading documents...</p>}
              {!docsLoading &&
                DOC_LABELS.map(([k, label]) => (
                  <div key={k}>
                    <p className="text-[11px] font-bold text-white/50 mb-1">{label}</p>
                    {docUrls[k] ? (
                      <a href={docUrls[k]} target="_blank" rel="noreferrer">
                        <img src={docUrls[k]} alt={label} className="w-full h-[180px] object-cover rounded-xl border border-white/10" />
                      </a>
                    ) : (
                      <div className="h-[180px] rounded-xl border border-dashed border-white/20 flex items-center justify-center text-[12px] text-white/40">
                        Not available
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {docsFor.status !== "approved" && (
                <button disabled={busy} onClick={() => setStatus(docsFor, "approved")} className="bg-green-500 text-black font-black px-6 py-3 rounded-full text-[13px] disabled:opacity-50">
                  {docsFor.status === "pending" ? "Approve" : "Approve again"}
                </button>
              )}
              {docsFor.status === "pending" && (
                <button disabled={busy} onClick={() => setRejectFor(docsFor)} className="bg-red-500/20 text-red-300 font-black px-6 py-3 rounded-full text-[13px]">
                  Reject
                </button>
              )}
              {docsFor.status === "approved" && (
                <button disabled={busy} onClick={() => suspend(docsFor)} className="bg-amber-500/20 text-amber-300 font-black px-6 py-3 rounded-full text-[13px]">
                  Suspend
                </button>
              )}
              <button onClick={() => setDocsFor(null)} className="bg-white/10 font-black px-6 py-3 rounded-full text-[13px]">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject reason */}
      {rejectFor && (
        <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-6">
          <div className="bg-[#1c202a] border border-white/10 rounded-[24px] p-7 max-w-[420px] w-full">
            <h3 className="font-black text-[18px]">Reject {rejectFor.full_name}?</h3>
            <p className="text-[12px] text-white/50 mt-1">Give a short reason so you remember why.</p>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. Selfie does not match the National ID"
              className="mt-4 w-full rounded-xl bg-[#0f1115] border border-white/10 p-3 text-[13px]"
            />
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setRejectFor(null); setReason("") }} className="flex-1 h-[48px] bg-white/10 rounded-full font-black">Cancel</button>
              <button disabled={busy} onClick={() => setStatus(rejectFor, "rejected", reason)} className="flex-1 h-[48px] bg-red-500 text-white rounded-full font-black disabled:opacity-50">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}