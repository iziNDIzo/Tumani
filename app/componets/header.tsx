"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isDriver, setIsDriver] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsDriver(localStorage.getItem("tumani_is_driver") === "true")
  }, [])

  const becomeDriver = () => {
    localStorage.setItem("tumani_is_driver", "true")
    setIsDriver(true)
    router.push("/drive")
  }

  const exitDriver = () => {
    localStorage.removeItem("tumani_is_driver")
    setIsDriver(false)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center gap-2">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm">T</div>
          <span className="font-extrabold text-[17px] text-gray-900 tracking-tight">Tumani</span>
        </Link>

        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <Link href="/marketplace" className="text-[13px] md:text-sm font-bold text-gray-600 px-2 py-2 whitespace-nowrap">Marketplace</Link>

          {!isDriver? (
            <>
              <button onClick={becomeDriver} className="text-[12px] md:text-sm font-bold text-blue-700 px-3 py-2 rounded-full border border-blue-200 whitespace-nowrap leading-tight text-center">I'm a<br className="md:hidden"/> Driver</button>
              <Link href="/drive" className="px-4 md:px-5 py-2.5 rounded-full bg-blue-600 text-white text-[13px] md:text-sm font-bold whitespace-nowrap">+ Post</Link>
            </>
          ) : (
            <>
              <Link href="/my-trips" className="text-[13px] md:text-sm font-bold text-blue-600 px-2 whitespace-nowrap">My Trips</Link>
              <Link href="/drive" className="px-4 md:px-5 py-2.5 rounded-full bg-blue-600 text-white text-[13px] md:text-sm font-bold whitespace-nowrap">+ Post</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}