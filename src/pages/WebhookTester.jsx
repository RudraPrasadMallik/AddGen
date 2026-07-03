import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { MdContentCopy, MdWebhook, MdDelete, MdRefresh, MdCircle } from 'react-icons/md';
import { useSEO } from '../utils/useSEO';
import api, { API_BASE_URL } from '../services/api';
import { getSessionId } from '../utils/session';
import './WebhookTester.css';

function WebhookTester() {
  useSEO({
    title: 'Free Webhook Tester - Capture & Inspect HTTP Requests',
    description: 'Get a unique webhook URL to capture and inspect incoming HTTP requests in real-time. Test webhooks from Stripe, GitHub, Razorpay and more. Free online tool.',
  });
  const [webhookUrl, setWebhookUrl] = useState('');
  const [endpointId, setEndpointId] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    createOrGetEndpoint();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!endpointId) return;

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
          socket.emit('subscribeWebhook', endpointId);
        });
        socket.on('webhookReceived', (data) => {
          setRequests((prev) => [data, ...prev]);
          toast.info(`Webhook received: ${data.method}`);
        });
        socketRef.current = socket;
      } catch (err) {
        console.warn('[WS] Socket not available for webhooks');
      }
    };

    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('unsubscribeWebhook', endpointId);
      }
    };
  }, [endpointId]);

  const createOrGetEndpoint = async () => {
    try {
      setLoading(true);
      const sessionId = getSessionId();
      const response = await api.post('/webhook-api/create', { session_id: sessionId });
      const data = response.data;
      setWebhookUrl(data.url);
      setEndpointId(data.endpoint_id);
      setExpiresAt(data.expires_at);
      // Fetch existing requests
      await fetchRequests(data.endpoint_id);
    } catch (err) {
      toast.error('Failed to create webhook endpoint');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (id) => {
    try {
      const epId = id || endpointId;
      const response = await api.get(`/webhook-api/requests/${epId}`);
      setRequests(response.data.requests || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const handleClearRequests = async () => {
    try {
      await api.delete(`/webhook-api/requests/${endpointId}`);
      setRequests([]);
      setSelectedRequest(null);
      toast.success('Requests cleared');
    } catch (err) {
      toast.error('Failed to clear requests');
    }
  };

  const handleRefresh = () => {
    fetchRequests();
    toast.info('Refreshed');
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('Webhook URL copied!');
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString();
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: '#10b981',
      POST: '#3b82f6',
      PUT: '#f59e0b',
      PATCH: '#8b5cf6',
      DELETE: '#ef4444',
    };
    return colors[method] || '#64748b';
  };

  return (
    <main className="webhook-page">
      <div className="webhook-header">
        <h1 className="webhook-title">
          <MdWebhook className="webhook-title-icon" />
          Webhook Tester
        </h1>
        <p className="webhook-subtitle">
          Get a unique URL to receive and inspect webhook requests in real-time.
        </p>
      </div>

      {loading ? (
        <div className="webhook-loading">Creating your endpoint...</div>
      ) : (
        <>
          {/* URL Display */}
          <div className="webhook-url-card">
            <div className="url-label">Your Webhook URL</div>
            <div className="url-row">
              <code className="url-value">{webhookUrl}</code>
              <button className="url-copy-btn" onClick={copyUrl}>
                <MdContentCopy /> Copy
              </button>
            </div>
            <div className="url-info">
              Send any HTTP request (GET, POST, PUT, DELETE) to this URL. Expires at {new Date(expiresAt).toLocaleString()}.
            </div>
          </div>

          {/* Controls */}
          <div className="webhook-controls">
            <div className="request-count">
              <MdCircle className="live-dot" />
              <span>{requests.length} request{requests.length !== 1 ? 's' : ''} captured</span>
            </div>
            <div className="control-btns">
              <button className="wh-btn refresh-btn" onClick={handleRefresh}>
                <MdRefresh /> Refresh
              </button>
              <button className="wh-btn clear-btn" onClick={handleClearRequests}>
                <MdDelete /> Clear All
              </button>
            </div>
          </div>

          {/* Request List + Detail */}
          <div className="webhook-content">
            <div className="request-list">
              {requests.length === 0 ? (
                <div className="empty-state">
                  <MdWebhook className="empty-icon" />
                  <p>Waiting for requests...</p>
                  <span>Send a request to your URL to see it here</span>
                </div>
              ) : (
                requests.map((req, index) => (
                  <div
                    key={req._id || index}
                    className={`request-item ${selectedRequest === req ? 'selected' : ''}`}
                    onClick={() => setSelectedRequest(req)}
                  >
                    <span className="req-method" style={{ color: getMethodColor(req.method) }}>
                      {req.method}
                    </span>
                    <span className="req-time">{formatTime(req.received_at)}</span>
                    <span className="req-ip">{req.ip}</span>
                  </div>
                ))
              )}
            </div>

            {/* Request Detail */}
            {selectedRequest && (
              <div className="request-detail">
                <div className="detail-section">
                  <h4>General</h4>
                  <div className="detail-row">
                    <span className="detail-key">Method</span>
                    <span className="detail-val" style={{ color: getMethodColor(selectedRequest.method) }}>
                      {selectedRequest.method}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Time</span>
                    <span className="detail-val">{new Date(selectedRequest.received_at).toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">IP</span>
                    <span className="detail-val">{selectedRequest.ip}</span>
                  </div>
                </div>

                {selectedRequest.query && Object.keys(selectedRequest.query).length > 0 && (
                  <div className="detail-section">
                    <h4>Query Params</h4>
                    <pre className="detail-code">{JSON.stringify(selectedRequest.query, null, 2)}</pre>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Headers</h4>
                  <pre className="detail-code">{JSON.stringify(selectedRequest.headers, null, 2)}</pre>
                </div>

                <div className="detail-section">
                  <h4>Body</h4>
                  <pre className="detail-code">
                    {typeof selectedRequest.body === 'string'
                      ? selectedRequest.body
                      : JSON.stringify(selectedRequest.body, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default WebhookTester;
