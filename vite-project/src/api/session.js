import api from './index';

export const createSession = async (username, password) => {
  const res = await api.post('/sessions', { username, password });
  return res.data;
};

export const joinSession = async (code, username, password) => {
  const res = await api.post(`/sessions/${code}`, { username, password });
  return res.data;
};