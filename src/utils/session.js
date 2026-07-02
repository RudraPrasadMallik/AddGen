import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'temp_mail_session_id';

/**
 * Get existing session ID from localStorage or create a new one
 */
export const getSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

/**
 * Clear the current session (used when changing email)
 */
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

/**
 * Reset session with a new UUID
 */
export const resetSession = () => {
  const newSessionId = uuidv4();
  localStorage.setItem(SESSION_KEY, newSessionId);
  return newSessionId;
};
