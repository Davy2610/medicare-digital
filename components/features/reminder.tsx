"use client"

import { useState } from "react"
import { Bell, Clock, Trash2, Plus, Pill } from "lucide-react"
import { useToast } from "@/components/toast-provider"

type Reminder = {
  id: string
  name: string
  time: string
  active: boolean
}

const INITIAL: Reminder[] = [
  { id: "r1", name: "Omeprazole 20mg", time: "07:00", active: true },
  { id: "r2", name: "Amoxicillin 500mg", time: "13:00", active: true },
  { id: "r3", name: "Cetirizine 10mg", time: "21:00", active: false },
  { id: "r4", name: "Vitamin D3", time: "08:30", active: true },
]

export function ReminderFeature() {
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL)
  const [name, setName] = useState("")
  const [time, setTime] = useState("")
  const { showToast } = useToast()

  function toggle(id: string) {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)))
  }

  function remove(id: string) {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !time) return
    setReminders((prev) => [
      ...prev,
      { id: `r${Date.now()}`, name: name.trim(), time, active: true },
    ])
    showToast(`Pengingat "${name.trim()}" pada ${time} ditambahkan`)
    setName("")
    setTime("")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Reminder list */}
      <div className="rounded-2xl border border-[#E4E0D6] bg-white p-6">
        <div className="mb-5 flex items-center gap-2">
          <Bell className="size-5 text-[#1F4B3F]" aria-hidden="true" />
          <h3 className="font-serif text-lg text-[#201F1C]">Pengingat Obat</h3>
        </div>

        {reminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E4E0D6] py-12 text-center">
            <Bell className="mb-2 size-8 text-[#201F1C]/25" aria-hidden="true" />
            <p className="text-sm text-[#201F1C]/50">Belum ada pengingat</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {reminders.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-4 rounded-xl border border-[#E4E0D6] bg-[#F6F4EF]/60 p-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#B8763A]/15 text-[#B8763A]">
                  <Pill className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`truncate font-medium ${r.active ? "text-[#201F1C]" : "text-[#201F1C]/40 line-through"}`}>
                    {r.name}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-[#201F1C]/60">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {r.time}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={r.active}
                  aria-label={`${r.active ? "Nonaktifkan" : "Aktifkan"} pengingat ${r.name}`}
                  onClick={() => toggle(r.id)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${r.active ? "bg-[#1F4B3F]" : "bg-[#E4E0D6]"}`}
                >
                  <span
                    className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${r.active ? "translate-x-[22px]" : "translate-x-0.5"}`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  className="shrink-0 rounded-md p-1.5 text-[#201F1C]/40 transition-colors hover:bg-white hover:text-[#B8763A]"
                  aria-label={`Hapus pengingat ${r.name}`}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add form */}
      <form
        onSubmit={handleSubmit}
        className="h-fit rounded-2xl border border-[#E4E0D6] bg-white p-6"
      >
        <div className="mb-5 flex items-center gap-2">
          <Plus className="size-5 text-[#1F4B3F]" aria-hidden="true" />
          <h3 className="font-serif text-lg text-[#201F1C]">Tambah Pengingat</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="rem-name" className="mb-1.5 block text-sm font-medium text-[#201F1C]">
              Nama Obat
            </label>
            <input
              id="rem-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Paracetamol 500mg"
              className="w-full rounded-xl border border-[#E4E0D6] bg-[#F6F4EF]/40 px-4 py-2.5 text-sm text-[#201F1C] outline-none transition-colors placeholder:text-[#201F1C]/35 focus:border-[#1F4B3F] focus:bg-white"
            />
          </div>
          <div>
            <label htmlFor="rem-time" className="mb-1.5 block text-sm font-medium text-[#201F1C]">
              Waktu
            </label>
            <input
              id="rem-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl border border-[#E4E0D6] bg-[#F6F4EF]/40 px-4 py-2.5 text-sm text-[#201F1C] outline-none transition-colors focus:border-[#1F4B3F] focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim() || !time}
            className="w-full rounded-xl bg-[#1F4B3F] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#163A30] disabled:cursor-not-allowed disabled:bg-[#E4E0D6] disabled:text-[#201F1C]/40"
          >
            Simpan Pengingat
          </button>
        </div>
      </form>
    </div>
  )
}
