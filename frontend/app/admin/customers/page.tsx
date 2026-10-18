'use client';
import * as api from '@/lib/api';
import { useAdminData } from '@/lib/useAdminData';
import { money } from '@/lib/format';

export default function CustomersPage() {
  const { data, error, loading } = useAdminData(api.adminCustomers);
  return (
    <section className="panel">
      <h2>Customers {data && <small>({data.length})</small>}</h2>
      {error && <p className="error" role="alert">{error}</p>}
      {loading && !data && <p>Loading…</p>}
      {data && data.length === 0 && <p className="muted">No customers have registered yet.</p>}
      {data && data.length > 0 && (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th className="r">Orders</th><th className="r">Spent</th></tr></thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td><td>{c.email}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="r">{c.orders}</td><td className="r">{money(c.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
