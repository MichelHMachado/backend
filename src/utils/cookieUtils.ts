/**
 * Parse a cookie header string into an object mapping cookie names to values.
 *
 * @param {string} cookieHeader - The raw cookie header string from the request.
 * @returns {Record<string, string>} An object mapping cookie names to their decoded values.
 */
export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value) {
      cookies[key.trim()] = decodeURIComponent(value.trim());
    }
  }
  return cookies;
}
