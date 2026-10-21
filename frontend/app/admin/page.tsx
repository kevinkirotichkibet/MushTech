'use client';
import Link from 'next/link';
import * as api from '@/lib/api';
import { useAdminData } from '@/lib/useAdminData';
import { money } from '@/lib/format';
import { AreaChart, BarChart, Donut } from '@/components/admin/Charts';

const STATUS_COLORS: Record<string, string> = { pending: '#C9A24A', confirmed: '#4F6B25', delivered: '#A9BE7E', cancelled: '#B4553F' };
const short = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const compact = (n: number) => (n >= 1000 ? `${+(n / 1000).toFixed(1)}k` : String(Math.round(n)));

export default function Dashboard() {
  const { data: s, error, loading } = useAdminData(api.adminStats);
  if (error) return <p className="error" role="alert">{error}</p>;
  if (!s) return <p>{loading ? 'Loading…' : ''}</p>;

  const t = s.totals;
  const stockRows = s.stock.filter((p) => !p.comingSoon);
  const maxStock = Math.max(1, ...stockRows.map((p) => p.stockKg));
  const maxTop = Math.max(1, ...s.top.map((p) => p.kg));

  return (
    <>
      <section className="kpis" aria-label="Key figures">
        <div className="kpi k1"><div><small>Revenue</small><span>Today {money(t.revenueToday)}</span></div><strong>{money(t.revenue)}</strong></div>
        <div className="kpi k2"><div><small>Orders</small><span>Today {t.ordersToday}</span></div><strong>{t.orders}</strong></div>
        <div className="kpi k3"><div><small>Pending</small><span>Need action</span></div><strong>{t.pending}</strong></div>
        <div className="kpi k4"><div><small>Customers</small><span>Registered</span></div><strong>{t.customers}</strong></div>
      </section>

      <div className="adm-grid">
        <section className="panel p-wide">
          <h2>Orders, last 14 days</h2>
          <BarChart label="Orders per day for the last 14 days" data={s.daily.map((d) => ({ label: short(d.date), value: d.orders }))} />
        </section>
        <section className="panel p-narrow">
          <h2>Orders by status</h2>
          <div className="donut-wrap">
            <Donut label="Orders by status" segments={Object.entries(s.byStatus).map(([label, value]) => ({ label, value, color: STATUS_COLORS[label] }))} />
            <ul className="legend">
              {Object.entries(s.byStatus).map(([k, v]) => <li key={k}><i style={{ background: STATUS_COLORS[k] }} />{k}<b>{v}</b></li>)}
            </ul>
          </div>
        </section>

        <section className="panel p-wide">
          <h2>Revenue, last 14 days</h2>
          <AreaChart label="Revenue per day for the last 14 days" format={compact} data={s.daily.map((d) => ({ label: short(d.date), value: d.revenue }))} />
        </section>
        <section className="panel p-narrow">
          <h2>Top sellers (kg sold)</h2>
          {s.top.length === 0 && <p className="muted">No sales yet.</p>}
          <ul className="bars">
            {s.top.map((p) => (
              <li key={p.name}><span>{p.name}</span><div className="track"><i style={{ width: `${(p.kg / maxTop) * 100}%` }} /></div><b>{p.kg} kg</b></li>
            ))}
          </ul>
        </section>

        <section className="panel p-narrow">
          <h2>Stock on hand</h2>
          <ul className="bars">
            {stockRows.map((p) => (
              <li key={p.name} className={p.stockKg < 10 ? 'low' : ''}><span>{p.name}</span><div className="track"><i style={{ width: `${(p.stockKg / maxStock) * 100}%` }} /></div><b>{p.stockKg} kg</b></li>
            ))}
          </ul>
          <p className="muted small">Bars turn red under 10 kg.</p>
        </section>
        <section className="panel p-wide">
          <h2>Recent orders</h2>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Ref</th><th>Customer</th><th>Status</th><th className="r">Total</th><th>Date</th></tr></thead>
              <tbody>
                {s.recent.length === 0 && <tr><td colSpan={5} className="muted">No orders yet.</td></tr>}
                {s.recent.map((o) => (
                  <tr key={o._id}>
                    <td><code>{o._id.slice(-6)}</code></td><td>{o.customerName}</td>
                    <td><span className={`pill ${o.status}`}>{o.status}</span></td>
                    <td className="r">{money(o.total)}</td><td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/admin/orders" className="more">All orders →</Link>
        </section>
      </div>
    </>
  );
}
