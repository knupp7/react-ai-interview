import api from './index';

export const postProfileInfo = (code, profileData) => {
  return api.post(`/sessions/${code}/profile`, profileData);
};

export const postInterviewInfo = (code, interviewData) => {
  return api.post(`/sessions/${code}/interview_info`, interviewData);
};

export async function postPersona(sessionCode) {
  const res = await api.post(`/sessions/${sessionCode}/persona`);
  return res.data;
}

export async function getPersona(sessionCode) {
    const res = await api.get(`/sessions/${sessionCode}/persona`);
    return res.data;
}

export async function postQuestions(sessionCode, payload) {
  const res = await api.post(`/sessions/${sessionCode}/questions`, payload);
  return res.data;
}