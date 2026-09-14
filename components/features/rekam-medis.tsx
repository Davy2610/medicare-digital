"use client"

import { useState } from "react"
import { ChevronDown, User, Droplet, TriangleAlert, CalendarDays, Stethoscope } from "lucide-react"

type Visit = {
  id: string
  date: string
  doctor: string
  diagnosis: string
  notes: string
}

const PATIENT = {
  name: "Achmad Raihan Davy",
  age: 21,
  bloodType: "B+",
  allergies: "Penisilin, Debu",
}

const VISITS: Visit[] = [
  {
    id: "v1",
    date: "12 Sep 2026",
    doctor: "dr. Anindita, Sp.PD",
    diagnosis: "Gastritis akut",
    notes:
      "Pasien mengeluh nyeri ulu hati sejak 3 hari. Diberikan Omeprazole 20mg 1x sehari selama 14 hari. Disarankan makan teratur dan hindari makanan pedas serta kopi.",
  },
  {
    id: "v2",
    date: "28 Jul 2026",
    doctor: "dr. Bagas Prasetyo",
    diagnosis: "ISPA (infeksi saluran napas atas)",
    notes:
      "Batuk berdahak dan demam ringan. Diresepkan Amoxicillin 500mg 3x sehari dan Paracetamol bila demam. Kontrol kembali bila keluhan menetap lebih dari 5 hari.",
  },
  {
    id: "v3",
    date: "10 Mei 2026",
    doctor: "dr. Citra Larasati",
    diagnosis: "Rhinitis alergi",
    notes:
      "Bersin dan hidung tersumbat berulang saat pagi. Diberikan Cetirizine 10mg 1x sehari malam hari. Disarankan menghindari paparan debu dan menggunakan masker.",
  },
  {
    id: "v4",
    date: "02 Feb 2026",
    doctor: "dr. Anindita, Sp.PD",
    diagnosis: "Pemeriksaan rutin",
    notes:
      "Kondisi umum baik. Kadar vitamin D sedikit rendah, diberikan suplemen Vitamin D3 1000 IU. Tekanan darah 118/76 mmHg, dalam batas normal.",
  },
]

export function MedicalRecordFeature() {
  const [openId, setOpenId] = useState<string | null>("v1")

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
      {/* Patient profile */}
      <div className="h-fit rounded-2xl border border-[#E4E0D6] bg-white p-6">
        <div className="mb-5 flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-[#1F4B3F] text-white">
            <User className="size-7" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-serif text-xl text-[#201F1C]">{PATIENT.name}</h3>
            <p className="text-sm text-[#201F1C]/60">{PATIENT.age} tahun · No. RM 20260012</p>
          </div>
        </div>

        <dl className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-[#E4E0D6] bg-[#F6F4EF]/60 p-3">
            <Droplet className="size-5 shrink-0 text-[#B8763A]" aria-hidden="true" />
            <div>
              <dt className="text-xs text-[#201F1C]/55">Golongan Darah</dt>
              <dd className="font-medium text-[#201F1C]">{PATIENT.bloodType}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[#E4E0D6] bg-[#F6F4EF]/60 p-3">
            <TriangleAlert className="size-5 shrink-0 text-[#B8763A]" aria-hidden="true" />
            <div>
              <dt className="text-xs text-[#201F1C]/55">Alergi</dt>
              <dd className="font-medium text-[#201F1C]">{PATIENT.allergies}</dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Visit history accordion */}
      <div className="rounded-2xl border border-[#E4E0D6] bg-white p-6">
        <div className="mb-5 flex items-center gap-2">
          <CalendarDays className="size-5 text-[#1F4B3F]" aria-hidden="true" />
          <h3 className="font-serif text-lg text-[#201F1C]">Riwayat Kunjungan</h3>
        </div>

        <ul className="space-y-3">
          {VISITS.map((visit) => {
            const open = openId === visit.id
            return (
              <li key={visit.id} className="overflow-hidden rounded-xl border border-[#E4E0D6]">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : visit.id)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-[#F6F4EF]/60"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1F4B3F]/10 text-[#1F4B3F]">
                    <Stethoscope className="size-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[#201F1C]">{visit.diagnosis}</p>
                    <p className="truncate text-sm text-[#201F1C]/60">
                      {visit.date} · {visit.doctor}
                    </p>
                  </div>
                  <ChevronDown
                    className={`size-5 shrink-0 text-[#201F1C]/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={`grid transition-all duration-200 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-[#E4E0D6] p-4 text-sm leading-relaxed text-[#201F1C]/75">
                      {visit.notes}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
