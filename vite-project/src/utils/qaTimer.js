// utils/qaTimer.js
const key = (sc) => `qaDurations:${sc}`;

const read = (k) => {
  try { return JSON.parse(localStorage.getItem(k)) || { list: [], active: {} }; }
  catch { return { list: [], active: {} }; }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const resetQATimers = (sessionCode) => write(key(sessionCode), { list: [], active: {} });

export const startQATimer = (sessionCode, qId) => {
  const k = key(sessionCode), d = read(k);
  d.active[qId] = performance.now();
  write(k, d);
};

export const stopQATimer = (sessionCode, qId) => {
  const k = key(sessionCode), d = read(k);
  const t0 = d.active[qId];
  if (t0 != null) {
    const ms = performance.now() - t0;
    if (ms >= 500) d.list.push(ms);  // 0.5초 미만 노이즈 제거
    delete d.active[qId];
    write(k, d);
  }
};

export const getAvgAnswerSeconds = (sessionCode) => {
  const { list = [] } = read(key(sessionCode));
  if (!list.length) return null;
  return Math.round(list.reduce((a, b) => a + b, 0) / list.length / 1000);
};