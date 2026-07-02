import React from 'react';
import { MdArrowBack, MdPerson, MdSubject, MdAccessTime } from 'react-icons/md';
import './EmailViewer.css';

function EmailViewer({ email, onBack }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="email-viewer">
      <div className="viewer-header">
        <button className="back-btn" onClick={onBack} aria-label="Back to inbox">
          <MdArrowBack />
          <span>Back to Inbox</span>
        </button>
        <span className="viewer-date">{formatDate(email.received_at)}</span>
      </div>

      <div className="viewer-content">
        <div className="viewer-subject-bar">
          <h2 className="viewer-subject">{email.subject}</h2>
        </div>

        <div className="viewer-meta">
          <div className="sender-info">
            <div className="sender-avatar-large">
              {email.sender ? email.sender.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="sender-details">
              <span className="sender-name">{email.sender}</span>
              <span className="sender-label">to me</span>
            </div>
          </div>
        </div>

        <div className="viewer-body">
          <div
            className="email-body-content"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />
        </div>
      </div>
    </div>
  );
}

export default EmailViewer;
