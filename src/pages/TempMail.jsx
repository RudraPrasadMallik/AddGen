import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import EmailDisplay from '../components/EmailDisplay';
import ActionButtons from '../components/ActionButtons';
import Inbox from '../components/Inbox';
import EmailViewer from '../components/EmailViewer';
import InfoSection from '../components/InfoSection';
import { getOrAssignEmail, changeEmail, getInbox, deleteInbox, API_BASE_URL } from '../services/api';
import { getSessionId } from '../utils/session';

function TempMail() {
  const [email, setEmail] = useState('');
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchEmail();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!email) return;

    const setupSocket = async () => {
      try {
        const { io } = await import('socket.io-client');
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        const socket = io(API_BASE_URL, {
          transports: ['websocket', 'polling'],
        });
        socket.on('connect', () => {
          socket.emit('subscribe', email);
        });
        socket.on('newEmail', (message) => {
          setInbox((prev) => [message, ...prev]);
          toast.info(`New email from: ${message.sender}`);
        });
        socketRef.current = socket;
      } catch (err) {
        console.warn('[WS] Socket.io not available:', err.message);
      }
    };

    setupSocket();

    const interval = setInterval(() => {
      fetchInbox(email);
    }, 10000);

    return () => {
      clearInterval(interval);
      if (socketRef.current) {
        socketRef.current.emit('unsubscribe', email);
      }
    };
  }, [email]);

  const fetchEmail = async () => {
    try {
      setLoading(true);
      const sessionId = getSessionId();
      const data = await getOrAssignEmail(sessionId);
      const addr = typeof data === 'string' ? data : data.email_address;
      setEmail(addr);
      fetchInbox(addr);
    } catch (error) {
      toast.error('Failed to get email. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const fetchInbox = async (emailAddress) => {
    if (!emailAddress) return;
    try {
      setInboxLoading(true);
      const messages = await getInbox(emailAddress);
      setInbox(Array.isArray(messages) ? messages : []);
    } catch (error) {
      console.error('Error fetching inbox:', error);
    } finally {
      setInboxLoading(false);
    }
  };

  const handleCopy = useCallback(() => {
    if (email) {
      navigator.clipboard.writeText(email);
      toast.success('Email copied to clipboard!');
    }
  }, [email]);

  const handleRefresh = useCallback(() => {
    if (email) {
      fetchInbox(email);
      toast.info('Inbox refreshed');
    }
  }, [email]);

  const handleChange = async () => {
    try {
      setLoading(true);
      const sessionId = getSessionId();
      const data = await changeEmail(sessionId);
      const addr = typeof data === 'string' ? data : data.email_address;
      setEmail(addr);
      setInbox([]);
      setSelectedEmail(null);
      toast.success('New email generated!');
      fetchInbox(addr);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        toast.error(error.response.data.error || 'Too many requests. Wait a minute.');
      } else {
        toast.error('Failed to change email.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (email) {
        await deleteInbox(email);
      }
      setInbox([]);
      setSelectedEmail(null);
      toast.info('Inbox cleared');
    } catch (error) {
      setInbox([]);
      setSelectedEmail(null);
      toast.info('Inbox cleared');
    }
  };

  const handleEmailSelect = (msg) => setSelectedEmail(msg);
  const handleBackToInbox = () => setSelectedEmail(null);

  return (
    <main className="main-content">
      <div className="email-section">
        <EmailDisplay email={email} loading={loading} onCopy={handleCopy} />
        <ActionButtons
          onCopy={handleCopy}
          onRefresh={handleRefresh}
          onChange={handleChange}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      {selectedEmail ? (
        <EmailViewer email={selectedEmail} onBack={handleBackToInbox} />
      ) : (
        <Inbox
          messages={inbox}
          loading={inboxLoading}
          onSelectEmail={handleEmailSelect}
        />
      )}

      <InfoSection />
    </main>
  );
}

export default TempMail;
