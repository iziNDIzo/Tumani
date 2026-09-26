"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
const dict = {
  en: {
    title: "Become a verified driver",
    sub: "We check your National ID, licence and a selfie. Only admins see your documents. Customers see your name, photo and vehicle.",
    loginTitle: "Log in first",
    loginSub: "You need an account to apply, so your application is linked to you.",
    loginBtn: "Log in / Sign up",
    checking: "Loading...",
    personal: "About you",
    name: "Full name as on National ID",
    phone: "Phone number (Airtel/TNM)",
    nationalId: "National ID number",
    licence: "Driving licence number",
    vehicleTitle: "Your vehicle",
    vType: "Vehicle type",
    make: "Make (e.g. Toyota)",
    model: "Model (e.g. Hiace)",
    colour: "Colour",
    plate: "Number plate",
    seats: "Passenger seats",
    servicesTitle: "What can you do?",
    sSeat: "Carry passengers",
    sParcel: "Carry parcels",
    sTaxi: "Taxi rides",
    uploads: "Safety verification (private)",
    idFront: "National ID front",
    idBack: "National ID back",
    selfie: "Selfie holding National ID",
    licencePhoto: "Driving licence",
    uploadTap: "Tap to upload",
    agree: "I confirm I have a valid licence and Blue Book. I will not carry banned items. I understand fake documents = permanent ban.",
    banned: "Banned: cash >MK100k, drugs, weapons, unpackaged phones",
    submit: "Submit for verification",
    submitting: "Submitting...",
    successTitle: "Application sent!",
    successSub: "We will review your documents. You can check your status on this page. Status: PENDING",
    goHome: "Go home",
    changeLang: "EN | NY",
    private: "Documents are private, only admins see them",
    status: {
      pending: ["Application under review", "We are checking your documents. Please check back soon."],
      approved: ["You are a verified driver", "Your profile is now visible to customers."],
      rejected: ["Application not approved", "Please contact Tumani support for details."],
      suspended: ["Account suspended", "Please contact Tumani support."],
    },
  },
  ny: {
    title: "Khalani dalaivala wotsimikizika",
    sub: "Timatsimikizira National ID, License ndi selfie. Ma admin okha ndi omwe amaona zikalata zanu.",
    loginTitle: "Lowani choyamba",
    loginSub: "Muyenera kukhala ndi akaunti kuti mutumize pempho.",
    loginBtn: "Lowani / Lembetsani",
    checking: "Kudikira...",
    personal: "Za inu",
    name: "Dzina lonse pa National ID",
    phone: "Nambala ya foni (Airtel/TNM)",
    nationalId: "Nambala ya National ID",
    licence: "Nambala ya License",
    vehicleTitle: "Galimoto yanu",
    vType: "Mtundu wa galimoto",
    make: "Kampani (mwachitsanzo Toyota)",
    model: "Model (mwachitsanzo Hiace)",
    colour: "Mtundu",
    plate: "Nambala ya galimoto",
    seats: "Mipando ya anthu",
    servicesTitle: "Mungathe kuchita chiyani?",
    sSeat: "Kunyamula anthu",
    sParcel: "Kunyamula katundu",
    sTaxi: "Taxi",
    uploads: "Chitsimikizo cha chitetezo (chachinsinsi)",
    idFront: "National ID Kutsogolo",
    idBack: "National ID Kumbuyo",
    selfie: "Selfie mutanyamula National ID",
    licencePhoto: "License",
    uploadTap: "Dinani kuti mukweze",
    agree: "Ndikutsimikiza kuti ndili ndi License + Blue Book. Sindidzanyamula zoletsedwa. Zikalata zabodza = kuletsedwa kosatha.",
    banned: "Zoletsedwa: ndalama >MK100k, mankhwala, zida, mafoni opanda bokosi",
    submit: "Tumizani kuti mutsimikizidwe",
    submitting: "Kutumiza...",
    successTitle: "Pempho latumizidwa!",
    successSub: "Tidzayang'ana zikalata zanu. Mukhoza kuona status pa tsamba lino. Status: PENDING",
    goHome: "Pitani kunyumba",
    changeLang: "NY | EN",
    private: "Zikalata zachinsinsi, ma admin okha amaona",
    status: {
      pending: ["Pempho likuyang'aniridwa", "Tikuyang'ana zikalata zanu. Bwererani posachedwa."],
      approved: ["Ndinu dalaivala wotsimikizika", "Mbiri yanu tsopano ikuonekera kwa makasitomala."],
      rejected: ["Pempho silinavomerezedwe", "Lumikizanani ndi Tumani kuti mudziwe zambiri."],
      suspended: ["Akaunti yaimitsidwa", "Lumikizanani ndi Tumani."],
    },
  },
}

type FileKey = "idFront" | "idBack" | "selfie" | "licence"
const FILE_KEYS: FileKey[] = ["idFront", "idBack", "selfie", "licence"]
const MAX_MB = 8

const VEHICLE_TYPES = ["sedan", "hatchback", "suv", "pickup", "minibus", "truck", "motorbike", "other"]

const inputCls = "mt-1 w-full h-[46px] px-4 rounded-[12px] border border-gray-200 text-[13px]"
const labelCls = "text-[11px] font-bold opacity-60"

export default function ApplyDriver() {
  const [lang, setLang] = useState<"en" | "ny">("en")
  const t = dict[lang]

  const [checking, setChecking] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [existing, setExisting] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "", phone: "", nationalId: "", licence: "",
    vType: "sedan", make: "", model: "", colour: "", plate: "", seats: "3",
  })
  const [services, setServices] = useState<string[]>(["seat", "parcel"])
  const [files, setFiles] = useState<Record<FileKey, File | null>>({
    idFront: null, idBack: null, selfie: null, licence: null,
  })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  // Who is logged in, and have they already applied?
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data } = await supabase
          .from("drivers")
          .select("status")
          .eq("user_id", user.id)
          .maybeSingle()
        if (data) setExisting(data.status)
      }
      setChecking(false)
    }
    load()
  }, [])

  const set = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v })

  const toggleService = (s: string) =>
    setServices(services.includes(s) ? services.filter(x => x !== s) : [...services, s])

  const pickFile = (k: FileKey, f: File | null) => {
    if (f && f.size > MAX_MB * 1024 * 1024) {
      alert(`Photo is too big. Maximum ${MAX_MB}MB.`)
      return
    }
    setFiles({ ...files, [k]: f })
  }

  // Files go in a folder named after the user's id (the security rules require this)
  const uploadFile = async (file: File, key: string) => {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const path = `${userId}/${Date.now()}_${key}_${safe}`
    const { error } = await supabase.storage.from("driver-docs").upload(path, file)
    if (error) throw error
    return path
  }

  const handleSubmit = async () => {
    if (!userId) return alert("Please log in first")
    if (!form.name || !form.phone || !form.nationalId || !form.licence || !form.plate)
      return alert("Fill all required fields")
    const seatsNum = parseInt(form.seats, 10)
    if (isNaN(seatsNum) || seatsNum < 0 || seatsNum > 30) return alert("Seats must be between 0 and 30")
    if (services.length === 0) return alert("Choose at least one service")
    if (FILE_KEYS.some(k => !files[k])) return alert("Upload all 4 photos")
    if (!agreed) return alert("Tick the agreement")

    setLoading(true)
    try {
      const idFront = await uploadFile(files.idFront!, "id_front")
      const idBack = await uploadFile(files.idBack!, "id_back")
      const selfie = await uploadFile(files.selfie!, "selfie")
      const licence = await uploadFile(files.licence!, "licence")

      // Public profile (only becomes visible once an admin approves the driver)
      const { error: pErr } = await supabase.from("driver_profiles").upsert(
        {
          user_id: userId,
          display_name: form.name.trim(),
          vehicle_type: form.vType,
          vehicle_make: form.make.trim() || null,
          vehicle_model: form.model.trim() || null,
          vehicle_color: form.colour.trim() || null,
          plate_number: form.plate.trim().toUpperCase(),
          seats: seatsNum,
          services,
        },
        { onConflict: "user_id" }
      )
      if (pErr) throw pErr

      // Private verification record. Status is always 'pending' here;
      // only an admin can change it.
      const { error: dErr } = await supabase.from("drivers").insert({
        user_id: userId,
        full_name: form.name.trim(),
        phone: form.phone.trim(),
        national_id_number: form.nationalId.trim(),
        license_number: form.licence.trim(),
        national_id_front_path: idFront,
        national_id_back_path: idBack,
        selfie_path: selfie,
        license_path: licence,
      })
      if (dErr) throw dErr

      setDone(true)
    } catch (e: any) {
      console.log(e)
      alert("Error: " + e.message)
    }
    setLoading(false)
  }

  const Header = (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <a href="/" className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[16px]">←</a>
        <a href="/" className="font-black text-[20px] flex items-center gap-2">
          <span className="w-8 h-8 bg-[#0a84ff] rounded-[10px] text-white flex items-center justify-center">T</span>tumani
        </a>
      </div>
      <button onClick={() => setLang(lang === "en" ? "ny" : "en")} className="h-[32px] px-4 rounded-full border border-gray-200 text-[11px] font-bold">
        {t.changeLang}
      </button>
    </div>
  )

  const Card = ({ icon, title, sub, children }: { icon: string; title: string; sub: string; children?: any }) => (
    <div className="min-h-screen bg-[#fafafa] text-[#010d19]">
      <div className="max-w-[520px] mx-auto px-5 py-8">
        {Header}
        <div className="bg-white border border-gray-100 rounded-[24px] p-8 text-center shadow-xl">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[24px]">{icon}</div>
          <h1 className="font-black text-[22px] mt-4">{title}</h1>
          <p className="text-[13px] text-[#010d19]/60 mt-2">{sub}</p>
          {children}
        </div>
      </div>
    </div>
  )

  if (checking) return <Card icon="⏳" title={t.checking} sub="" />

  if (!userId) {
    return (
      <Card icon="🔐" title={t.loginTitle} sub={t.loginSub}>
        <a href="/login" className="mt-6 block h-[44px] leading-[44px] bg-[#0a84ff] text-white rounded-full font-bold text-[13px]">{t.loginBtn}</a>
      </Card>
    )
  }

  if (done) {
    return (
      <Card icon="✅" title={t.successTitle} sub={t.successSub}>
        <p className="text-[11px] bg-amber-50 border border-amber-200 p-3 rounded-[12px] mt-4">{t.banned}</p>
        <a href="/" className="mt-6 block h-[44px] leading-[44px] bg-[#010d19] text-white rounded-full font-bold text-[13px]">{t.goHome}</a>
      </Card>
    )
  }

  if (existing) {
    const s = (t.status as Record<string, string[]>)[existing] ?? t.status.pending
    const icon = existing === "approved" ? "✅" : existing === "pending" ? "⏳" : "⛔"
    return (
      <Card icon={icon} title={s[0]} sub={s[1]}>
        <a href="/" className="mt-6 block h-[44px] leading-[44px] bg-[#010d19] text-white rounded-full font-bold text-[13px]">{t.goHome}</a>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#010d19]">
      <div className="max-w-[520px] mx-auto px-5 py-8">
        {Header}
        <h1 className="text-[26px] font-black leading-[0.95] tracking-[-0.02em]">{t.title}</h1>
        <p className="text-[12px] text-[#010d19]/60 mt-2 leading-[1.5]">{t.sub}</p>

        <div className="mt-6 bg-white border border-gray-100 rounded-[20px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-4">
          <div className="text-[11px] font-black tracking-widest opacity-70">{t.personal}</div>
          <div>
            <label className={labelCls}>{t.name}</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t.phone}</label>
            <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="099..." className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t.nationalId}</label>
              <input value={form.nationalId} onChange={e => set("nationalId", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t.licence}</label>
              <input value={form.licence} onChange={e => set("licence", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="pt-2 text-[11px] font-black tracking-widest opacity-70">{t.vehicleTitle}</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t.vType}</label>
              <select value={form.vType} onChange={e => set("vType", e.target.value)} className={inputCls}>
                {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t.plate}</label>
              <input value={form.plate} onChange={e => set("plate", e.target.value)} placeholder="RU 1234" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t.make}</label>
              <input value={form.make} onChange={e => set("make", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t.model}</label>
              <input value={form.model} onChange={e => set("model", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t.colour}</label>
              <input value={form.colour} onChange={e => set("colour", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t.seats}</label>
              <input type="number" min={0} max={30} value={form.seats} onChange={e => set("seats", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <div className={labelCls}>{t.servicesTitle}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {([["seat", t.sSeat], ["parcel", t.sParcel], ["taxi", t.sTaxi]] as const).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggleService(k)}
                  className={`h-[36px] px-4 rounded-full text-[12px] font-bold border ${
                    services.includes(k) ? "bg-[#0a84ff] text-white border-[#0a84ff]" : "bg-white border-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <div className="text-[11px] font-black tracking-widest opacity-70 mb-2">{t.uploads}</div>
            <div className="grid grid-cols-2 gap-2">
              {FILE_KEYS.map(k => (
                <label key={k} className="bg-gray-50 border border-dashed border-gray-300 rounded-[14px] h-[92px] flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">
                  {files[k] ? (
                    <span className="text-[10px] font-bold text-green-600 p-1 text-center">✓ {files[k]!.name.slice(0, 16)}</span>
                  ) : (
                    <>
                      <span className="text-[18px]">{k === "selfie" ? "🤳" : k === "licence" ? "🚗" : "🪪"}</span>
                      <span className="text-[10px] font-bold mt-1 opacity-60 text-center px-1">
                        {k === "idFront" ? t.idFront : k === "idBack" ? t.idBack : k === "selfie" ? t.selfie : t.licencePhoto}
                      </span>
                      <span className="text-[8px] opacity-40">{t.uploadTap}</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={e => pickFile(k, e.target.files?.[0] || null)} />
                </label>
              ))}
            </div>
          </div>

          <label className="flex gap-2 items-start bg-amber-50 border border-amber-200 p-3 rounded-[12px] cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5" />
            <span className="text-[10px] leading-[1.4] font-medium">
              {t.agree}<br /><span className="opacity-60">{t.banned}</span>
            </span>
          </label>

          <button onClick={handleSubmit} disabled={loading} className="w-full h-[50px] rounded-full bg-[#0a84ff] text-white font-black text-[14px] disabled:opacity-50">
            {loading ? t.submitting : t.submit}
          </button>
        </div>

        <div className="text-center text-[10px] opacity-40 mt-4">🔒 {t.private}</div>
      </div>
    </div>
  )
}
