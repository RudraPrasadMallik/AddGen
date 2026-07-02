import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MdContentCopy, MdVpnKey, MdLock, MdInfo } from 'react-icons/md';
import './PKCEGenerator.css';

// Generate a cryptographically random code_verifier (43-128 chars, URL-safe)
function generateCodeVerifier(length = 64) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

// SHA-256 hash the verifier and base64url encode it to get the challenge
async function generateCodeChallengeS256(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  return base64UrlEncode(hashArray);
}

// Plain method — challenge is same as verifier
function generateCodeChallengePlain(verifier) {
  return verifier;
}

// Base64 URL encode (no padding, URL-safe chars)
function base64UrlEncode(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function PKCEGenerator() {
  const [verifier, setVerifier] = useState('');
  const [challenge, setChallenge] = useState('');
  const [method, setMethod] = useState('S256');
  const [verifierGenerated, setVerifierGenerated] = useState(false);
  const [challengeGenerated, setChallengeGenerated] = useState(false);

  const handleGenerateVerifier = () => {
    const newVerifier = generateCodeVerifier(64);
    setVerifier(newVerifier);
    setVerifierGenerated(true);
    setChallenge('');
    setChallengeGenerated(false);
    toast.success('Code Verifier generated!');
  };

  const handleGenerateChallenge = async () => {
    if (!verifier) {
      toast.error('Generate Code Verifier first!');
      return;
    }

    let newChallenge;
    if (method === 'S256') {
      newChallenge = await generateCodeChallengeS256(verifier);
    } else {
      newChallenge = generateCodeChallengePlain(verifier);
    }

    setChallenge(newChallenge);
    setChallengeGenerated(true);
    toast.success('Code Challenge generated!');
  };

  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    // Reset challenge when method changes
    setChallenge('');
    setChallengeGenerated(false);
  };

  const copyToClipboard = (value, label) => {
    if (!value) {
      toast.error(`Generate ${label} first!`);
      return;
    }
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied!`);
  };

  return (
    <main className="pkce-page">
      <div className="pkce-header">
        <h1 className="pkce-title">
          <MdVpnKey className="pkce-title-icon" />
          PKCE Generator
        </h1>
        <p className="pkce-subtitle">
          Generate Code Verifier and Code Challenge pairs for OAuth 2.0 PKCE flows. Each pair is unique to your session.
        </p>
      </div>

      <div className="pkce-info-box">
        <MdInfo className="info-icon" />
        <div>
          <strong>How to use:</strong> Generate a Code Verifier first, select the method, then generate the Code Challenge. 
          Send the Challenge when requesting authorization, and the Verifier when exchanging the code.
        </div>
      </div>

      {/* Method Selector */}
      <div className="method-selector">
        <span className="method-label">Method:</span>
        <div className="method-toggle">
          <button
            className={`method-btn ${method === 'S256' ? 'active' : ''}`}
            onClick={() => handleMethodChange('S256')}
          >
            S256 (Recommended)
          </button>
          <button
            className={`method-btn ${method === 'plain' ? 'active' : ''}`}
            onClick={() => handleMethodChange('plain')}
          >
            Plain
          </button>
        </div>
      </div>

      <div className="pkce-cards">
        {/* Code Verifier */}
        <div className="pkce-card">
          <div className="pkce-card-header">
            <div className="pkce-card-label">
              <MdVpnKey />
              <span>Code Verifier</span>
            </div>
            <span className="pkce-method-badge">Secret</span>
          </div>
          <div className={`pkce-value-box ${verifierGenerated ? 'has-value' : ''}`}>
            {verifier ? (
              <code className="pkce-value">{verifier}</code>
            ) : (
              <span className="pkce-placeholder">Click "Generate Verifier" to create</span>
            )}
          </div>
          <div className="pkce-card-actions">
            <button className="pkce-generate-btn verifier-btn" onClick={handleGenerateVerifier}>
              <MdVpnKey />
              Generate Verifier
            </button>
            <button
              className="pkce-copy-btn"
              onClick={() => copyToClipboard(verifier, 'Code Verifier')}
              disabled={!verifier}
            >
              <MdContentCopy />
              Copy
            </button>
          </div>
          <p className="pkce-hint">Random 64-byte URL-safe string. Keep this secret — send it only during token exchange.</p>
        </div>

        {/* Code Challenge */}
        <div className="pkce-card">
          <div className="pkce-card-header">
            <div className="pkce-card-label">
              <MdLock />
              <span>Code Challenge</span>
            </div>
            <span className="pkce-method-badge">{method === 'S256' ? 'SHA-256' : 'Plain'}</span>
          </div>
          <div className={`pkce-value-box ${challengeGenerated ? 'has-value' : ''}`}>
            {challenge ? (
              <code className="pkce-value">{challenge}</code>
            ) : (
              <span className="pkce-placeholder">
                {verifier ? 'Click "Generate Challenge" to create from verifier' : 'Generate Verifier first'}
              </span>
            )}
          </div>
          <div className="pkce-card-actions">
            <button
              className="pkce-generate-btn challenge-btn"
              onClick={handleGenerateChallenge}
              disabled={!verifier}
            >
              <MdLock />
              Generate Challenge
            </button>
            <button
              className="pkce-copy-btn"
              onClick={() => copyToClipboard(challenge, 'Code Challenge')}
              disabled={!challenge}
            >
              <MdContentCopy />
              Copy
            </button>
          </div>
          <p className="pkce-hint">
            {method === 'S256'
              ? 'SHA-256 hash of the verifier (base64url encoded). Secure and recommended.'
              : 'Same as the verifier (no hashing). Not recommended for production use.'}
          </p>
        </div>
      </div>

      {/* Method Info */}
      <div className="pkce-method-info">
        <h3>Current Method: {method === 'S256' ? 'S256' : 'Plain'}</h3>
        <p>
          <code>
            {method === 'S256'
              ? 'code_challenge = BASE64URL(SHA256(code_verifier))'
              : 'code_challenge = code_verifier'}
          </code>
        </p>
      </div>
    </main>
  );
}

export default PKCEGenerator;
