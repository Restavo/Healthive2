import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Healthive - Manajemen Nutrisi & Berat Badan Personal",
  description:
    "Platform manajemen nutrisi dan berat badan berbasis data untuk gaya hidup sehat. Hitung BMI, lacak kalori, dapatkan rekomendasi menu, dan visualisasikan progres kesehatan Anda.",
  keywords: "healthive, nutrisi, berat badan, BMI, kalori, diet, kesehatan, fitness, pelacak makanan",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
