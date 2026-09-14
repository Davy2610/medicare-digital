import { HeartPulse } from "lucide-react"

const TEAM = [
  "Adzikra Wahyudi",
  "Achmad Raihan Davy",
  "Muhammad Okbo Syaifudin",
  "Muhamad Abduh Revan",
  "Tsaqif Rakha Harli",
]

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[#E4E0D6] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#1F4B3F] text-white">
                <HeartPulse className="size-5" aria-hidden="true" />
              </span>
              <span className="font-serif text-xl text-[#201F1C]">MediCare Digital</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#201F1C]/60">
              Platform layanan kesehatan digital untuk e-resep, rekam medis, dan pengingat obat.
            </p>
            <p className="mt-4 text-sm font-medium text-[#1F4B3F]">
              Tugas Manajemen Proyek Sistem Informasi — Kelas D, 2026
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#201F1C]">Anggota Tim</h3>
            <ul className="mt-3 space-y-2">
              {TEAM.map((name) => (
                <li key={name} className="text-sm text-[#201F1C]/70">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#E4E0D6] pt-6 text-xs text-[#201F1C]/45">
          © 2026 MediCare Digital. Dibuat untuk keperluan tugas akademik.
        </div>
      </div>
    </footer>
  )
}
