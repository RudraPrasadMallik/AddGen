import React from 'react';
import { MdMailOutline, MdInbox, MdChevronRight } from 'react-icons/md';
import './Inbox.css';

function Inbox({ messages, loading, onSelectEmail }) {
  return (
    <div className="inbox">
      <div className="inbox-title-bar">
        <h3 className="inbox-title">
          <MdInbox className="inbox-title-icon" />
          Inbox
        </h3>
        <span className="inbox-count">{messages.length} messages</span>
      </div>

      <div className="inbox-header">
        <span className="inbox-col sender">Sender</span>
        <span className="inbox-col subject">Subject</span>
        <span className="inbox-col time">Time</span>
      </div>

      <div className="inbox-body">
        {loading && messages.length === 0 ? (
          <div className="inbox-empty">
            <div className="loading-pulse"></div>
            <p>Checking for new messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="inbox-empty">
            <div className="empty-illustration">
              <MdMailOutline className="empty-icon" />
            </div>
            <p className="empty-title">No messages yet</p>
            <p className="empty-subtitle">Incoming emails will appear here automatically</p>
          </div>
        ) : (
          <div className="inbox-messages">
            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className="inbox-row"
                onClick={() => onSelectEmail(msg)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectEmail(msg)}
                aria-label={`Email from ${msg.sender}, subject: ${msg.subject}`}
              >
                <div className="inbox-row-col sender">
                  <div className="sender-avatar">
                    {msg.sender ? msg.sender.charAt(0).toUpperCase() : '?'}
                  </div>
                  <span className="sender-text">{msg.sender}</span>
                </div>
                <span className="inbox-row-col subject">{msg.subject}</span>
                <div className="inbox-row-col time">
                  <span className="time-text">
                    {msg.received_at ? new Date(msg.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                  <MdChevronRight className="chevron" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inbox;
