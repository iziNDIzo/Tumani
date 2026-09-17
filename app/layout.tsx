import "./globals.css"
import Header from "./components/header"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black antialiased">
        <Header />
        {children}
      </body>
    </html>
  )
}