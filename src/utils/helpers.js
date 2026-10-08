export function formatPrice(value) {
  return `$${Number(value).toLocaleString()}`;
}

export function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '-');
}
export function parseLocalDate(value, endOfDay = false) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return endOfDay
      ? new Date(year, month - 1, day, 23, 59, 59, 999)
      : new Date(year, month - 1, day);
  }
  return new Date(value);
}

export function formatLocalDate(value) {
  return parseLocalDate(value).toLocaleDateString();
}
