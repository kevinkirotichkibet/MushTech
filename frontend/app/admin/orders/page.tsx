'use client';
import * as api from '@/lib/api';
import { useAdminData } from '@/lib/useAdminData';
import { money } from '@/lib/format';

const STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const { data: orders, setData, error, setError, loading, token } = useAdminData(api.allOrders);

  async function status(id: string, s: string) {
    try {
      const o = await api.setOrderStatus(id, s, token!);
      setData((l) => (l ? l.map((x) => (x._id === id ? o : x)) : l));
    } catch (e: any) { setError(e.message); }
  }

  return (
    <section className="panel">
      <h2>All orders {orders && <small>({orders.length})</small>}</h2>
      {error && <p className="error" role="alert">{error}</p>}
      {loading && !orders && <p>Loading…</p>}
      {orders && orders.length === 0 && <p className="muted">No orders yet.</p>}
      {orders && orders.length > 0 && (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Ref</th><th>Customer</th><th>Items</th><th className="r">Total</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td><code>{o._id.slice(-6)}</code></td>
                  <td><strong>{o.customerName}</strong><br /><small>{o.phone}</small><br /><small>{o.address}</small></td>
                  <td>{(o.items ?? []).map((i, n) => <div key={n}>{i.name}, {i.qtyKg} kg</div>)}</td>
                  <td className="r">{money(o.total)}</td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td>
                    <select value={o.status} onChange={(e) => status(o._id, e.target.value)} aria-label={`Status for order ${o._id.slice(-6)}`}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
