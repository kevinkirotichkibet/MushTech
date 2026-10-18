export type OrderLike = {
  _id: unknown; customerName: string; total: number; status: string; createdAt: Date;
  items: { name: string; qtyKg: number; unitPrice: number }[];
};
export type StockLike = { name: string; stockKg: number; comingSoon?: boolean };

const STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled'] as const;

// "YYYY-MM-DD" for the shop's local day (offset in minutes from UTC)
const dayKey = (d: Date, offsetMin: number) => new Date(d.getTime() + offsetMin * 60_000).toISOString().slice(0, 10);

export function buildStats(
  rawOrders: OrderLike[],
  o: { customers: number; stock: StockLike[]; days?: number; now?: Date; offsetMinutes?: number },
) {
  // tolerate malformed or legacy documents (missing total/items/status) instead of failing
  const orders = rawOrders.map((x) => ({ ...x, total: Number(x.total) || 0, items: Array.isArray(x.items) ? x.items : [], status: x.status ?? 'pending' }));
  const days = o.days ?? 14;
  const off = o.offsetMinutes ?? 0;
  const now = o.now ?? new Date();
  const today = dayKey(now, off);

  const byStatus: Record<string, number> = { pending: 0, confirmed: 0, delivered: 0, cancelled: 0 };
  for (const x of orders) if (x.status in byStatus) byStatus[x.status]++;

  // cancelled orders do not count towards sales
  const counted = orders.filter((x) => x.status !== 'cancelled');

  const daily = Array.from({ length: days }, (_, i) => ({
    date: dayKey(new Date(now.getTime() - (days - 1 - i) * 86_400_000), off), orders: 0, revenue: 0,
  }));
  const slot = new Map(daily.map((d) => [d.date, d]));
  for (const x of counted) {
    const d = slot.get(dayKey(new Date(x.createdAt), off));
    if (d) { d.orders++; d.revenue = +(d.revenue + x.total).toFixed(2); }
  }

  const sold = new Map<string, { kg: number; revenue: number }>();
  for (const x of counted) for (const i of x.items) {
    const cur = sold.get(i.name ?? 'Unknown') ?? { kg: 0, revenue: 0 };
    cur.kg += Number(i.qtyKg) || 0; cur.revenue += (Number(i.qtyKg) || 0) * (Number(i.unitPrice) || 0);
    sold.set(i.name ?? 'Unknown', cur);
  }
  const top = [...sold.entries()]
    .map(([name, v]) => ({ name, kg: +v.kg.toFixed(2), revenue: +v.revenue.toFixed(2) }))
    .sort((a, b) => b.kg - a.kg).slice(0, 5);

  const todays = counted.filter((x) => dayKey(new Date(x.createdAt), off) === today);
  const recent = [...orders]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6)
    .map((x) => ({ _id: x._id, customerName: x.customerName, total: x.total, status: x.status, createdAt: x.createdAt }));

  return {
    totals: {
      orders: counted.length,
      ordersToday: todays.length,
      pending: byStatus.pending,
      revenue: +counted.reduce((s, x) => s + x.total, 0).toFixed(2),
      revenueToday: +todays.reduce((s, x) => s + x.total, 0).toFixed(2),
      customers: o.customers,
    },
    byStatus: Object.fromEntries(STATUSES.map((s) => [s, byStatus[s]])),
    daily, top, stock: o.stock, recent,
  };
}
