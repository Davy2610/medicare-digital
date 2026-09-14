"use client"

import { useMemo, useState } from "react"
import { Plus, Minus, Trash2, ShoppingCart, Pill, Stethoscope } from "lucide-react"
import { formatRupiah } from "@/lib/format"
import { useToast } from "@/components/toast-provider"

type Medicine = {
  id: string
  name: string
  dosage: string
  price: number
}

type CartItem = Medicine & { qty: number }

const PRESCRIPTION: Medicine[] = [
  { id: "amox", name: "Amoxicillin 500mg", dosage: "3x sehari sesudah makan", price: 24000 },
  { id: "para", name: "Paracetamol 500mg", dosage: "3x sehari bila demam", price: 12000 },
  { id: "omep", name: "Omeprazole 20mg", dosage: "1x sehari sebelum makan", price: 38000 },
  { id: "ceti", name: "Cetirizine 10mg", dosage: "1x sehari malam hari", price: 18500 },
  { id: "vitd", name: "Vitamin D3 1000 IU", dosage: "1x sehari sesudah makan", price: 45000 },
]

export function ERecipeFeature() {
  const [cart, setCart] = useState<CartItem[]>([])
  const { showToast } = useToast()

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

  function checkout() {
    if (cart.length === 0) return
    showToast(`Pesanan berhasil dibuat — ${formatRupiah(total)}`)
    setCart([])
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Prescription list */}
      <div className="rounded-2xl border border-[#E4E0D6] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#1F4B3F]/10 text-[#1F4B3F]">
            <Stethoscope className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-serif text-lg text-[#201F1C]">Resep dr. Anindita Sp.PD</h3>
            <p className="text-sm text-[#201F1C]/60">RS Sehat Sentosa · 12 Sep 2026</p>
          </div>
        </div>

        <ul className="space-y-3">
          {PRESCRIPTION.map((med) => (
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
  )
}
