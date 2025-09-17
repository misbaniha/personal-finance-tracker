export function formatDateISO(ts) {
  const d = new Date(ts);
  return d.toISOString().split('T')[0];
}

export function isToday(ts) {
  const d = new Date(ts);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}

export function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function startOfMonth(date = new Date()) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
