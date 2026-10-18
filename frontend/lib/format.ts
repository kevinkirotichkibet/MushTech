// Change the currency here once and the whole storefront follows.
const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);

export const money = (n: number) => (Number.isFinite(n) ? fmt(n) : '-');
export const kg = (n: number) => `${+n.toFixed(2)} kg`;
