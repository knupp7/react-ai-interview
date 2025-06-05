import api from "./index";

export async function getFinalEvaluation(sessionCode) {
  const res = await api.post(`/sessions/${sessionCode}/final_eval`);
  return res.data;
}