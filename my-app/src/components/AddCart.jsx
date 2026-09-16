// Rename closeCart to onClose
import { useMemo, useState } from "react";

const CartModal = ({ cartItems = [], onClose }) => {
  // Local copy to allow qty changes in the modal
  const [items, setItems] = useState(
    cartItems.map((it) => ({
      name: it.name || it.title || "Item",
      qty: typeof it.qty === "number" ? it.qty : 1,
      price: typeof it.price === "number" ? it.price : (it.price ? Number(it.price) : 0),
      id: it._id || it.id || Math.random().toString(36).slice(2, 9),
    }))
  );

  const increment = (id) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p)));
  };
  const decrement = (id) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p)));
  };

  const subtotal = useMemo(() => items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0), [items]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl p-6 sm:p-8 text-slate-900 transition-all">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-slate-600 hover:text-slate-900"
          onClick={onClose}
          aria-label="Close cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <header className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Cart</h2>
          <div className="text-sm text-slate-600">{items.length} {items.length === 1 ? 'item' : 'items'}</div>
        </header>

        <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
          {items.length === 0 && (
            <div className="py-12 text-center text-slate-500">Your cart is empty.</div>
          )}

          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center text-slate-400 text-sm">Img</div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{it.name}</div>
                  <div className="text-xs text-slate-500">{it.price ? `LKR ${it.price.toFixed(2)}` : "Price N/A"}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button onClick={() => decrement(it.id)} className="px-3 py-1 text-slate-600 hover:bg-slate-50">-</button>
                  <div className="px-4 py-1 bg-white text-sm font-medium">{it.qty}</div>
                  <button onClick={() => increment(it.id)} className="px-3 py-1 text-slate-600 hover:bg-slate-50">+</button>
                </div>
                <div className="text-sm font-semibold">LKR {(it.price * it.qty).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Subtotal</div>
            <div className="text-lg font-semibold">LKR {subtotal.toFixed(2)}</div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50">Close</button>
            <button className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700">Checkout</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CartModal;
