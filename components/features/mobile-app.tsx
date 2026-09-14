"use client"

import { useState } from "react"
import { Home, Pill, Bell, Clock, Activity, ChevronRight, Smartphone, Apple, Play } from "lucide-react"

type Screen = "home" | "resep" | "reminder"

const SCREENS: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Beranda", icon: Home },
  { id: "resep", label: "Resep", icon: Pill },
  { id: "reminder", label: "Reminder", icon: Bell },
]

export function MobileAppFeature() {
  const [screen, setScreen] = useState<Screen>("home")

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2">
      {/* Copy */}
      <div className="order-2 lg:order-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1F4B3F]/10 px-3 py-1 text-xs font-semibold text-[#1F4B3F]">
          <Smartphone className="size-3.5" aria-hidden="true" />
          Aplikasi Mobile
        </span>
        <h3 className="mt-4 font-serif text-3xl text-[#201F1C]">Kesehatanmu, dalam genggaman</h3>
        <p className="mt-3 max-w-md leading-relaxed text-[#201F1C]/65">
          Akses e-resep, rekam medis, dan pengingat obat langsung dari ponsel. Coba geser tampilan
          di samping untuk melihat pratinjau aplikasi MediCare Digital.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-[#201F1C] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            <Apple className="size-5" aria-hidden="true" />
            App Store
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[#E4E0D6] bg-white px-4 py-3 text-sm font-medium text-[#201F1C] transition-colors hover:bg-[#F6F4EF]"
          >
            <Play className="size-5" aria-hidden="true" />
            Google Play
          </button>
        </div>

        {/* Screen switchers */}
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-[#201F1C]/60">Ganti tampilan layar:</p>
          <div className="inline-flex gap-2 rounded-xl border border-[#E4E0D6] bg-white p-1.5">
            {SCREENS.map((s) => {
              const Icon = s.icon
              const active = screen === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScreen(s.id)}
                  aria-pressed={active}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-[#1F4B3F] text-white" : "text-[#201F1C]/70 hover:bg-[#F6F4EF]"}`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Phone frame */}
      <div className="order-1 flex justify-center lg:order-2">
        <div className="w-[280px] rounded-[2.5rem] border-[6px] border-[#201F1C] bg-[#201F1C] p-2 shadow-xl shadow-black/15">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#F6F4EF]">
            {/* notch */}
            <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-[#201F1C]" />
            <div className="h-[520px] overflow-y-auto px-4 pb-6 pt-9">
              <PhoneScreen screen={screen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PhoneScreen({ screen }: { screen: Screen }) {
  if (screen === "home") {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-xs text-[#201F1C]/55">Selamat pagi,</p>
          <p className="font-serif text-lg text-[#201F1C]">Raihan Davy</p>
        </div>
        <div className="rounded-2xl bg-[#1F4B3F] p-4 text-white">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <Activity className="size-3.5" aria-hidden="true" />
            Ringkasan Kesehatan
          </div>
          <div className="mt-3 flex justify-between">
            <div>
              <p className="text-xl font-semibold">118/76</p>
              <p className="text-[10px] text-white/60">Tekanan darah</p>
            </div>
            <div>
              <p className="text-xl font-semibold">72</p>
              <p className="text-[10px] text-white/60">Detak/mnt</p>
            </div>
            <div>
              <p className="text-xl font-semibold">98%</p>
              <p className="text-[10px] text-white/60">SpO₂</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E4E0D6] bg-white p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[#B8763A]">
            <Bell className="size-3.5" aria-hidden="true" />
            Pengingat Berikutnya
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#201F1C]">Omeprazole 20mg</p>
              <p className="text-xs text-[#201F1C]/55">Sebelum makan</p>
            </div>
            <span className="rounded-lg bg-[#F6F4EF] px-2 py-1 text-sm font-semibold text-[#1F4B3F]">
              07:00
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (screen === "resep") {
    const items = [
      { name: "Omeprazole 20mg", info: "1x sehari · 14 hari" },
      { name: "Amoxicillin 500mg", info: "3x sehari · 7 hari" },
      { name: "Vitamin D3", info: "1x sehari · rutin" },
    ]
    return (
      <div className="space-y-4">
        <p className="font-serif text-lg text-[#201F1C]">Resep Aktif</p>
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.name}
              className="flex items-center gap-3 rounded-2xl border border-[#E4E0D6] bg-white p-3"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#B8763A]/15 text-[#B8763A]">
                <Pill className="size-4.5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#201F1C]">{it.name}</p>
                <p className="truncate text-xs text-[#201F1C]/55">{it.info}</p>
              </div>
              <ChevronRight className="size-4 text-[#201F1C]/30" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const schedule = [
    { time: "07:00", name: "Omeprazole 20mg", done: true },
    { time: "08:30", name: "Vitamin D3", done: true },
    { time: "13:00", name: "Amoxicillin 500mg", done: false },
    { time: "21:00", name: "Amoxicillin 500mg", done: false },
  ]
  return (
    <div className="space-y-4">
      <p className="font-serif text-lg text-[#201F1C]">Jadwal Hari Ini</p>
      <div className="space-y-3">
        {schedule.map((s, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-[#E4E0D6] bg-white p-3">
            <span className="flex w-12 flex-col items-center">
              <Clock className="size-3.5 text-[#1F4B3F]" aria-hidden="true" />
              <span className="text-xs font-semibold text-[#201F1C]">{s.time}</span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#201F1C]">{s.name}</p>
              <p className={`text-xs ${s.done ? "text-[#1F4B3F]" : "text-[#201F1C]/45"}`}>
                {s.done ? "Sudah diminum" : "Belum diminum"}
              </p>
            </div>
            <span
              className={`size-2.5 rounded-full ${s.done ? "bg-[#1F4B3F]" : "bg-[#E4E0D6]"}`}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
