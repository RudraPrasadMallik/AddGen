import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get or assign a temporary email for the given session
 * POST /email/get
 * Returns: { email_address, status, session_id, ... }
 */
export const getOrAssignEmail = async (sessionId) => {
  const response = await api.post('/email/get', { session_id: sessionId });
  return response.data.email;
};

/**
 * Change the current email for the given session
 * POST /email/change
 * Returns: { email_address, status, session_id, ... }
 */
export const changeEmail = async (sessionId) => {
  const response = await api.post('/email/change', { session_id: sessionId });
  return response.data.email;
};

/**
 * Fetch inbox messages for the given email
 * GET /inbox?email=
 */
export const getInbox = async (email) => {
  const response = await api.get('/inbox', { params: { email } });
  return response.data.messages || [];
};

/**
 * Delete all messages in the inbox for the given email
 * DELETE /inbox
 */
export const deleteInbox = async (email) => {
  const response = await api.delete('/inbox', { data: { email } });
  return response.data;
};

export { API_BASE_URL };
export default api;
