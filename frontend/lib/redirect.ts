// Only allow redirects to paths on this site (blocks "//evil.com" style open redirects).
export function safeNext(search: string, fallback = '/') {
  const next = new URLSearchParams(search).get('next') || '';
  return next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}
