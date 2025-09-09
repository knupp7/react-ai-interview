import api from "./index";

const key = (code) => `finalEval:${code}:v1`;
const inFlight = new Map();

/**
 * 세션당 1회만 네트워크 요청.
 * - 캐시가 있으면 무조건 캐시 반환 (네트워크 호출 X)
 * - force === true일 때만 캐시 무시하고 재요청
 *
 * @param {string} sessionCode
 * @param {{ force?: boolean }=} options
 * @returns {Promise<any>}
 */
export async function getFinalEvaluation(sessionCode, options = {}) {
  const { force = false } = options;

  if (!sessionCode) {
    throw new Error("getFinalEvaluation: sessionCode가 없습니다.");
  }

  const storageKey = key(sessionCode);

  // 1) 캐시 체크: force가 아니면 바로 반환
  if (!force) {
    const cached = readCache(storageKey);
    if (cached) return cached;
  }

  // 2) 동시 중복 호출 방지
  if (inFlight.has(storageKey)) {
    return inFlight.get(storageKey);
  }

  // 3) 네트워크 요청 (한 번만)
  const req = (async () => {
    const res = await api.post(`/sessions/${sessionCode}/final_eval`);
    const data = res.data;

    // 성공 시 캐시 저장
    writeCache(storageKey, data);

    return data;
  })();

  inFlight.set(storageKey, req);

  try {
    const data = await req;
    return data;
  } finally {
    // 완료되면 inFlight 해제
    inFlight.delete(storageKey);
  }
}

export function invalidateFinalEvaluation(sessionCode) {
  if (!sessionCode) return;
  localStorage.removeItem(key(sessionCode));
}

function readCache(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}


function writeCache(storageKey, data) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch {
    // 용량 초과 등으로 실패할 수 있음 (무시)
  }
}