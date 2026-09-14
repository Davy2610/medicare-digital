"use client"

import { useState } from "react"
import { HeartPulse, Pill, FileText, Bell, Smartphone } from "lucide-react"
import { ToastProvider } from "@/components/toast-provider"
import { ERecipeFeature } from "@/components/features/eresep"
import { MedicalRecordFeature } from "@/components/features/rekam-medis"
import { ReminderFeature } from "@/components/features/reminder"
import { MobileAppFeature } from "@/components/features/mobile-app"
import { Footer } from "@/components/footer"

type TabId = "eresep" | "rekam" | "reminder" | "mobile"

const TABS: { id: TabId; label: string; icon: typeof Pill }[] = [
  { id: "eresep", label: "E-Resep", icon: Pill },
  { id: "rekam", label: "Rekam Medis", icon: FileText },
  { id: "reminder", label: "Reminder Obat", icon: Bell },
  { id: "mobile", label: "Aplikasi Mobile", icon: Smartphone },
]

export default function Page() {
  const [tab, setTab] = useState<TabId>("eresep")

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F6F4EF] font-sans text-[#201F1C]">
        {/* Navbar */}
        <header className="sticky top-0 z-40 border-b border-[#E4E0D6] bg-[#F6F4EF]/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#1F4B3F] text-white">
                <HeartPulse className="size-5" aria-hidden="true" />
              </span>
              <span className="font-serif text-xl text-[#201F1C]">MediCare Digital</span>
            </div>
            <span className="hidden rounded-full border border-[#E4E0D6] bg-white px-3 py-1 text-xs font-medium text-[#1F4B3F] sm:inline">
              Layanan Kesehatan Digital
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Hero */}
          <section className="pt-12 pb-8 text-center sm:pt-16">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E0D6] bg-white px-3 py-1 text-xs font-medium text-[#B8763A]">
              <HeartPulse className="size-3.5" aria-hidden="true" />
              Sehat lebih mudah, di mana saja
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl text-balance font-serif text-4xl leading-tight text-[#201F1C] sm:text-5xl md:text-6xl">
              Kelola kesehatanmu secara digital
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-[#201F1C]/65">
              Tebus resep, simpan rekam medis, atur pengingat obat, dan pantau semuanya lewat satu
              platform yang hangat dan mudah digunakan.
            </p>

            {/* Tab navigation */}
            <div
              role="tablist"
              aria-label="Fitur MediCare Digital"
              className="mt-8 inline-flex max-w-full flex-wrap justify-center gap-2 rounded-2xl border border-[#E4E0D6] bg-white p-2"
            >
              {TABS.map((t) => {
                const Icon = t.icon
                const active = tab === t.id
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${t.id}`}
                    id={`tab-${t.id}`}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#1F4B3F] text-white"
                        : "text-[#201F1C]/70 hover:bg-[#F6F4EF]"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Feature panel */}
          <section
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            className="pb-4"
          >
            {tab === "eresep" && <ERecipeFeature />}
            {tab === "rekam" && <MedicalRecordFeature />}
            {tab === "reminder" && <ReminderFeature />}
            {tab === "mobile" && <MobileAppFeature />}
          </section>
        </main>

        <Footer />
      </div>
    </ToastProvider>
  )
}
