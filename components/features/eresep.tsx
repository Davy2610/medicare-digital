"use client"

import { useMemo, useState } from "react"
import { Plus, Minus, Trash2, ShoppingCart, Pill, Stethoscope, UserRound, ClipboardPlus } from "lucide-react"
import { formatRupiah } from "@/lib/format"
import { useToast } from "@/components/toast-provider"

type Medicine = {
  id: string
  patient: string
  name: string
  dosage: string
  price: number
  doctor: string
}

type CartItem = Medicine & { qty: number }

const DEFAULT_DOCTOR = "dr. Anindita Sp.PD"

const INITIAL_PRESCRIPTIONS: Medicine[] = [
  { id: "amox", patient: "Budi Santoso", name: "Amoxicillin 500mg", dosage: "3x sehari sesudah makan", price: 24000, doctor: DEFAULT_DOCTOR },
  { id: "para", patient: "Budi Santoso", name: "Paracetamol 500mg", dosage: "3x sehari bila demam", price: 12000, doctor: DEFAULT_DOCTOR },
  { id: "omep", patient: "Budi Santoso", name: "Omeprazole 20mg", dosage: "1x sehari sebelum makan", price: 38000, doctor: DEFAULT_DOCTOR },
  { id: "ceti", patient: "Budi Santoso", name: "Cetirizine 10mg", dosage: "1x sehari malam hari", price: 18500, doctor: DEFAULT_DOCTOR },
  { id: "vitd", patient: "Budi Santoso", name: "Vitamin D3 1000 IU", dosage: "1x sehari sesudah makan", price: 45000, doctor: DEFAULT_DOCTOR },
]

type View = "pasien" | "dokter"

const inputClass =
  "w-full rounded-lg border border-[#E4E0D6] bg-[#F6F4EF]/60 px-3 py-2 text-sm text-[#201F1C] outline-none transition-colors placeholder:text-[#201F1C]/40 focus:border-[#1F4B3F] focus:bg-white"

export function ERecipeFeature() {
  const [prescriptions, setPrescriptions] = useState<Medicine[]>(INITIAL_PRESCRIPTIONS)
  const [cart, setCart] = useState<CartItem[]>([])
  const [view, setView] = useState<View>("pasien")
  const { showToast } = useToast()

  const [form, setForm] = useState({
    patient: "",
    name: "",
    dosage: "",
    price: "",
    doctor: DEFAULT_DOCTOR,
  })

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart])
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart])

  function addToCart(med: Medicine) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === med.id)
      if (existing) {
        return prev.map((i) => (i.id === med.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...med, qty: 1 }]
    })
    showToast(`${med.name} ditambahkan ke keranjang`)
  }

  function changeQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    )
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  function addPrescription(e: React.FormEvent) {
    e.preventDefault()
    const price = Number(form.price)
    if (!form.patient.trim() || !form.name.trim() || !form.dosage.trim() || !Number.isFinite(price) || price <= 0) {
      return
    }
    const newPrescription: Medicine = {
      id: `rx-${Date.now()}`,
      patient: form.patient.trim(),
      name: form.name.trim(),
      dosage: form.dosage.trim(),
      price,
      doctor: form.doctor.trim() || DEFAULT_DOCTOR,
    }
    setPrescriptions((prev) => [newPrescription, ...prev])
    setForm({ patient: "", name: "", dosage: "", price: "", doctor: DEFAULT_DOCTOR })
    showToast("Resep berhasil ditambahkan")
  }

  function removePrescription(id: string) {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id))
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  function checkout() {
    if (cart.length === 0) return
    showToast(`Pesanan berhasil dibuat — ${formatRupiah(total)}`)
    setCart([])
  }

  return (
    <div className="space-y-6">
      {/* View toggle */}
      <div className="inline-flex rounded-xl border border-[#E4E0D6] bg-white p-1">
        <button
          type="button"
          onClick={() => setView("pasien")}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            view === "pasien" ? "bg-[#1F4B3F] text-white" : "text-[#201F1C]/70 hover:bg-[#F6F4EF]"
          }`}
        >
          <UserRound className="size-4" aria-hidden="true" />
          Pasien
        </button>
        <button
          type="button"
          onClick={() => setView("dokter")}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            view === "dokter" ? "bg-[#1F4B3F] text-white" : "text-[#201F1C]/70 hover:bg-[#F6F4EF]"
          }`}
        >
          <Stethoscope className="size-4" aria-hidden="true" />
          Dokter/Admin
        </button>
      </div>

      {view === "pasien" ? (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Prescription list */}
          <div className="rounded-2xl border border-[#E4E0D6] bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#1F4B3F]/10 text-[#1F4B3F]">
                <Stethoscope className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-serif text-lg text-[#201F1C]">Resep Digital Anda</h3>
                <p className="text-sm text-[#201F1C]/60">RS Sehat Sentosa · 12 Sep 2026</p>
              </div>
            </div>

            {prescriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E4E0D6] py-12 text-center">
                <Pill className="mb-2 size-8 text-[#201F1C]/25" aria-hidden="true" />
                <p className="text-sm text-[#201F1C]/50">Belum ada resep tersedia</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {prescriptions.map((med) => (
                  <li
                    key={med.id}
                    className="flex items-center gap-4 rounded-xl border border-[#E4E0D6] bg-[#F6F4EF]/60 p-4"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#B8763A]/15 text-[#B8763A]">
                      <Pill className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[#201F1C]">{med.name}</p>
                      <p className="truncate text-sm text-[#201F1C]/60">{med.dosage}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-[#201F1C]">{formatRupiah(med.price)}</span>
                    <button
                      type="button"
                      onClick={() => addToCart(med)}
                      className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#1F4B3F] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#163A30]"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                      Tambah
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cart */}
          <div className="rounded-2xl border border-[#E4E0D6] bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="size-5 text-[#1F4B3F]" aria-hidden="true" />
                <h3 className="font-serif text-lg text-[#201F1C]">Keranjang</h3>
              </div>
              <span className="rounded-full bg-[#1F4B3F]/10 px-2.5 py-0.5 text-xs font-semibold text-[#1F4B3F]">
                {itemCount} item
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E4E0D6] py-12 text-center">
                <ShoppingCart className="mb-2 size-8 text-[#201F1C]/25" aria-hidden="true" />
                <p className="text-sm text-[#201F1C]/50">Keranjang masih kosong</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {cart.map((item) => (
                  <li key={item.id} className="rounded-xl border border-[#E4E0D6] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#201F1C]">{item.name}</p>
                        <p className="text-xs text-[#201F1C]/60">{formatRupiah(item.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-md p-1 text-[#201F1C]/40 transition-colors hover:bg-[#F6F4EF] hover:text-[#B8763A]"
                        aria-label={`Hapus ${item.name}`}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-lg border border-[#E4E0D6]">
                        <button
                          type="button"
                          onClick={() => changeQty(item.id, -1)}
                          className="flex size-7 items-center justify-center rounded-l-lg text-[#201F1C] transition-colors hover:bg-[#F6F4EF]"
                          aria-label="Kurangi jumlah"
                        >
                          <Minus className="size-3.5" aria-hidden="true" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-[#201F1C]">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => changeQty(item.id, 1)}
                          className="flex size-7 items-center justify-center rounded-r-lg text-[#201F1C] transition-colors hover:bg-[#F6F4EF]"
                          aria-label="Tambah jumlah"
                        >
                          <Plus className="size-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-[#201F1C]">{formatRupiah(item.price * item.qty)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 border-t border-[#E4E0D6] pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-[#201F1C]/60">Total</span>
                <span className="font-serif text-xl text-[#1F4B3F]">{formatRupiah(total)}</span>
              </div>
              <button
                type="button"
                onClick={checkout}
                disabled={cart.length === 0}
                className="w-full rounded-xl bg-[#B8763A] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a2662f] disabled:cursor-not-allowed disabled:bg-[#E4E0D6] disabled:text-[#201F1C]/40"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Add prescription form */}
          <div className="rounded-2xl border border-[#E4E0D6] bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#1F4B3F]/10 text-[#1F4B3F]">
                <ClipboardPlus className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-serif text-lg text-[#201F1C]">Tambah Resep Baru</h3>
                <p className="text-sm text-[#201F1C]/60">Buat resep digital untuk pasien</p>
              </div>
            </div>

            <form onSubmit={addPrescription} className="space-y-4">
              <div>
                <label htmlFor="rx-patient" className="mb-1.5 block text-sm font-medium text-[#201F1C]">
                  Nama Pasien
                </label>
                <input
                  id="rx-patient"
                  type="text"
                  value={form.patient}
                  onChange={(e) => setForm((f) => ({ ...f, patient: e.target.value }))}
                  placeholder="cth. Budi Santoso"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="rx-name" className="mb-1.5 block text-sm font-medium text-[#201F1C]">
                  Nama Obat
                </label>
                <input
                  id="rx-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="cth. Amoxicillin 500mg"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="rx-dosage" className="mb-1.5 block text-sm font-medium text-[#201F1C]">
                  Dosis / Aturan Pakai
                </label>
                <input
                  id="rx-dosage"
                  type="text"
                  value={form.dosage}
                  onChange={(e) => setForm((f) => ({ ...f, dosage: e.target.value }))}
                  placeholder="cth. 3x sehari, 7 hari"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="rx-price" className="mb-1.5 block text-sm font-medium text-[#201F1C]">
                  Harga Obat (Rp)
                </label>
                <input
                  id="rx-price"
                  type="number"
                  min="0"
                  step="500"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="cth. 24000"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="rx-doctor" className="mb-1.5 block text-sm font-medium text-[#201F1C]">
                  Dokter Peresep
                </label>
                <input
                  id="rx-doctor"
                  type="text"
                  value={form.doctor}
                  onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}
                  placeholder="cth. dr. Anindita Sp.PD"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#1F4B3F] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#163A30]"
              >
                <Plus className="size-4" aria-hidden="true" />
                Tambahkan Resep
              </button>
            </form>
          </div>

          {/* Prescription list for admin */}
          <div className="rounded-2xl border border-[#E4E0D6] bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-serif text-lg text-[#201F1C]">Daftar Resep</h3>
              <span className="rounded-full bg-[#1F4B3F]/10 px-2.5 py-0.5 text-xs font-semibold text-[#1F4B3F]">
                {prescriptions.length} resep
              </span>
            </div>

            {prescriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E4E0D6] py-12 text-center">
                <ClipboardPlus className="mb-2 size-8 text-[#201F1C]/25" aria-hidden="true" />
                <p className="text-sm text-[#201F1C]/50">Belum ada resep dibuat</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {prescriptions.map((med) => (
                  <li key={med.id} className="rounded-xl border border-[#E4E0D6] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium text-[#201F1C]">{med.name}</p>
                          <span className="shrink-0 text-sm font-semibold text-[#1F4B3F]">{formatRupiah(med.price)}</span>
                        </div>
                        <p className="mt-0.5 truncate text-sm text-[#201F1C]/60">{med.dosage}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#201F1C]/60">
                          <span className="inline-flex items-center gap-1">
                            <UserRound className="size-3.5" aria-hidden="true" />
                            {med.patient}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Stethoscope className="size-3.5" aria-hidden="true" />
                            {med.doctor}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePrescription(med.id)}
                        className="shrink-0 rounded-md p-1.5 text-[#201F1C]/40 transition-colors hover:bg-[#F6F4EF] hover:text-[#B8763A]"
                        aria-label={`Hapus resep ${med.name}`}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
