// Prices are in Kenya shillings (Ksh). Every price on the site goes through money().
// Set NEXT_PUBLIC_CURRENCY_LABEL on Vercel to show a different label (default "Ksh").
const LABEL = process.env.NEXT_PUBLIC_CURRENCY_LABEL || 'Ksh';

// Plain en-US number grouping (1,250.50) matches Kenyan usage and is identical on the server and in the browser.
const num = (n: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);

// non-breaking space keeps "Ksh" and the amount on one line
export const money = (n: number) => (Number.isFinite(n) ? `${LABEL}\u00A0${num(n)}` : '-');
export const kg = (n: number) => `${+n.toFixed(2)} kg`;
