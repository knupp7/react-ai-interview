import api from './index';

export const postProfileInfo = (code, profileData) => {
  return api.post(`/sessions/${code}/profile`, profileData);
};

export const postInterviewInfo = (code, interviewData) => {
  return api.post(`/sessions/${code}/interview_info`, interviewData);
};