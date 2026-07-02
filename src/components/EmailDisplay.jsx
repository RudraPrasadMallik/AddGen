import React from 'react';
import { MdContentCopy, MdCheckCircle } from 'react-icons/md';
import { useState } from 'react';
import './EmailDisplay.css';

function EmailDisplay({ email, loading, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="email-display">
      <div className="email-card">
        <div className="email-card-label">Your disposable email</div>
        <div className="email-card-row">
          {loading ? (
            <div className="email-loading">
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
              <span>Generating your email...</span>
            </div>
          ) : (
            <>
              <span className="email-address">{email}</span>
              <button
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                title="Copy email"
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <MdCheckCircle />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <MdContentCopy />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
        <div className="email-card-info">
          This email will automatically expire. Use it to sign up for services without revealing your real address.
        </div>
      </div>
    </div>
  );
}

export default EmailDisplay;
