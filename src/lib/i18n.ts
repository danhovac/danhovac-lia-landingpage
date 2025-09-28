export type Locale = "ko" | "en";
const DEFAULT_LOCALE: Locale = "ko", COOKIE_NAME = "lang", COOKIE_MAX_AGE = 60 * 60 * 24 * 365, SUPPORTED = new Set<Locale>(["ko", "en"]);
type CopyTable = Record<Locale, Record<string, string>>;
let table: CopyTable = { ko: {}, en: {} };
const warned = new Set<string>();
const normalize = (value: string | null | undefined): Locale | null =>
  value ? ((next) => (SUPPORTED.has(next) ? next : null))(value.toLowerCase() as Locale) : null;
const readCookie = (name: string): string | null =>
  typeof document === "undefined"
    ? null
    : ((match) => (match ? decodeURIComponent(match[1]) : null))(document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`)));
export const getLocale = (): Locale => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = normalize(params.get("lang"));
    if (fromQuery) return fromQuery;
    const fromCookie = normalize(readCookie(COOKIE_NAME));
    if (fromCookie) return fromCookie;
  }
  return DEFAULT_LOCALE;
};
export const setLocale = (next: Locale) => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("lang", next);
  const search = url.searchParams.toString();
  window.history.replaceState(null, "", `${url.pathname}${search ? `?${search}` : ""}${url.hash}`);
  document.cookie = `${COOKIE_NAME}=${next};path=/;max-age=${COOKIE_MAX_AGE}`;
  const root = document.documentElement;
  if (!root) return;
  root.lang = next;
  root.dataset.locale = next;
};
export const createT = (locale: Locale) => (key: string) => {
  const localized = table[locale]?.[key];
  if (localized !== undefined) return localized;
  const fallback = table.ko?.[key];
  const warnKey = `${locale}:${key}`;
  if (fallback !== undefined) {
    if (!warned.has(warnKey)) { warned.add(warnKey); console.warn(`[i18n] Missing key "${key}" for locale "${locale}". Falling back to ko.`); }
    return fallback;
  }
  if (!warned.has(key)) { warned.add(key); console.warn(`[i18n] Missing key "${key}" in all locales.`); }
  return key;
};
export const setContentCopy = (next: CopyTable) => (table = next);
