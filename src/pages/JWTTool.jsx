import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MdContentCopy, MdLock, MdLockOpen, MdVpnKey, MdCheckCircle, MdError } from 'react-icons/md';
import { useSEO } from '../utils/useSEO';
import api from '../services/api';
import './JWTTool.css';

const ALGORITHMS = [
  { group: 'None', items: ['none'] },
  { group: 'HMAC', items: ['HS256', 'HS384', 'HS512'] },
  { group: 'RSA', items: ['RS256', 'RS384', 'RS512'] },
  { group: 'ECDSA', items: ['ES256', 'ES384', 'ES512'] },
  { group: 'RSA-PSS', items: ['PS256', 'PS384', 'PS512'] },
];

const DEFAULT_PAYLOAD = JSON.stringify({
  sub: "1234567890",
  name: "John Doe",
  iat: Math.floor(Date.now() / 1000),
}, null, 2);

function JWTTool() {
  useSEO({
    title: 'Free JWT Encoder & Decoder - JSON Web Token Tool',
    description: 'Encode, decode, and verify JSON Web Tokens online. Supports HS256, RS256, ES256, PS256 and all standard signing algorithms. Free JWT debugger.',
  });
  const [mode, setMode] = useState('decode'); // 'decode' or 'encode'
  const [algorithm, setAlgorithm] = useState('HS256');
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');

  // Decode state
  const [tokenInput, setTokenInput] = useState('');
  const [decodedHeader, setDecodedHeader] = useState(null);
  const [decodedPayload, setDecodedPayload] = useState(null);
  const [decodedSignature, setDecodedSignature] = useState('');
  const [tokenExpiry, setTokenExpiry] = useState(null);

  // Encode state
  const [payloadInput, setPayloadInput] = useState(DEFAULT_PAYLOAD);
  const [expiresIn, setExpiresIn] = useState('1h');
  const [encodedToken, setEncodedToken] = useState('');

  // Verify state
  const [verifyResult, setVerifyResult] = useState(null);

  const isAsymmetric = ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'PS256', 'PS384', 'PS512'].includes(algorithm);

  const handleDecode = async () => {
    if (!tokenInput.trim()) {
      toast.error('Paste a JWT token to decode');
      return;
    }
    try {
      const response = await api.post('/jwt/decode', { token: tokenInput.trim() });
      const data = response.data;
      setDecodedHeader(data.header);
      setDecodedPayload(data.payload);
      setDecodedSignature(data.signature);
      setTokenExpiry({ isExpired: data.isExpired, expiresIn: data.expiresIn });
      toast.success('Token decoded!');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to decode token';
      toast.error(msg);
      setDecodedHeader(null);
      setDecodedPayload(null);
    }
  };

  const handleEncode = async () => {
    try {
      const key = isAsymmetric ? privateKey : secret;
      if (algorithm !== 'none' && !key) {
        toast.error(isAsymmetric ? 'Private key is required' : 'Secret is required');
        return;
      }

      const response = await api.post('/jwt/encode', {
        payload: payloadInput,
        secret: key,
        algorithm,
        expiresIn: expiresIn || undefined,
      });

      setEncodedToken(response.data.token);
      toast.success('Token generated!');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to encode token';
      toast.error(msg);
    }
  };

  const handleVerify = async () => {
    if (!tokenInput.trim()) {
      toast.error('Paste a JWT token to verify');
      return;
    }
    try {
      const key = isAsymmetric ? publicKey : secret;
      const response = await api.post('/jwt/verify', {
        token: tokenInput.trim(),
        secret: key,
        algorithm,
      });
      setVerifyResult(response.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Verification failed';
      toast.error(msg);
    }
  };

  const handleGenerateKeys = async () => {
    try {
      const response = await api.post('/jwt/generate-keys', { algorithm });
      setPrivateKey(response.data.privateKey);
      setPublicKey(response.data.publicKey);
      toast.success(`${algorithm} key pair generated!`);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to generate keys';
      toast.error(msg);
    }
  };

  const copyToClipboard = (value, label) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied!`);
  };

  return (
    <main className="jwt-page">
      <div className="jwt-header">
        <h1 className="jwt-title">
          <MdLock className="jwt-title-icon" />
          JWT Encoder / Decoder
        </h1>
        <p className="jwt-subtitle">
          Decode, encode, and verify JSON Web Tokens. Supports all standard signing algorithms.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="jwt-mode-toggle">
        <button
          className={`mode-btn ${mode === 'decode' ? 'active' : ''}`}
          onClick={() => setMode('decode')}
        >
          <MdLockOpen /> Decoder
        </button>
        <button
          className={`mode-btn ${mode === 'encode' ? 'active' : ''}`}
          onClick={() => setMode('encode')}
        >
          <MdLock /> Encoder
        </button>
      </div>

      {/* Algorithm Selector */}
      <div className="jwt-controls">
        <div className="control-group">
          <label>Signing Algorithm</label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            {ALGORITHMS.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.items.map((alg) => (
                  <option key={alg} value={alg}>{alg}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Decode Mode */}
      {mode === 'decode' && (
        <div className="jwt-workspace">
          <div className="jwt-input-section">
            <label>Paste JWT Token</label>
            <textarea
              className="jwt-textarea token-input"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              rows={4}
            />
            <div className="btn-row">
              <button className="jwt-action-btn decode-btn" onClick={handleDecode}>
                <MdLockOpen /> Decode
              </button>
              <button className="jwt-action-btn verify-btn" onClick={handleVerify}>
                <MdCheckCircle /> Verify Signature
              </button>
            </div>
          </div>

          {/* Secret / Key for verification */}
          <div className="jwt-secret-section">
            {isAsymmetric ? (
              <div className="key-inputs">
                <div className="key-group">
                  <label>Public Key (for verification)</label>
                  <textarea
                    className="jwt-textarea key-area"
                    placeholder="-----BEGIN PUBLIC KEY-----&#10;...&#10;-----END PUBLIC KEY-----"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    rows={4}
                  />
                </div>
                <button className="generate-keys-btn" onClick={handleGenerateKeys}>
                  Generate {algorithm} Key Pair
                </button>
              </div>
            ) : (
              <div className="secret-group">
                <label>Secret</label>
                <input
                  type="text"
                  className="jwt-input"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="your-secret-key"
                />
              </div>
            )}
          </div>

          {/* Decoded Output */}
          {decodedHeader && (
            <div className="jwt-decoded">
              <div className="decoded-section">
                <div className="decoded-label">
                  <span>HEADER</span>
                  <button className="mini-copy" onClick={() => copyToClipboard(JSON.stringify(decodedHeader, null, 2), 'Header')}>
                    <MdContentCopy />
                  </button>
                </div>
                <pre className="decoded-content header-color">{JSON.stringify(decodedHeader, null, 2)}</pre>
              </div>
              <div className="decoded-section">
                <div className="decoded-label">
                  <span>PAYLOAD</span>
                  <button className="mini-copy" onClick={() => copyToClipboard(JSON.stringify(decodedPayload, null, 2), 'Payload')}>
                    <MdContentCopy />
                  </button>
                </div>
                <pre className="decoded-content payload-color">{JSON.stringify(decodedPayload, null, 2)}</pre>
                {tokenExpiry && (
                  <div className={`expiry-badge ${tokenExpiry.isExpired ? 'expired' : 'valid'}`}>
                    {tokenExpiry.isExpired ? (
                      <><MdError /> Token Expired</>
                    ) : (
                      <><MdCheckCircle /> Valid — expires in {Math.floor(tokenExpiry.expiresIn / 60)} min</>
                    )}
                  </div>
                )}
              </div>
              <div className="decoded-section">
                <div className="decoded-label">
                  <span>SIGNATURE</span>
                  <button className="mini-copy" onClick={() => copyToClipboard(decodedSignature, 'Signature')}>
                    <MdContentCopy />
                  </button>
                </div>
                <pre className="decoded-content signature-color">{decodedSignature}</pre>
              </div>

              {verifyResult && (
                <div className={`verify-result ${verifyResult.valid ? 'valid' : 'invalid'}`}>
                  {verifyResult.valid ? (
                    <><MdCheckCircle /> Signature Verified</>
                  ) : (
                    <><MdError /> Invalid Signature: {verifyResult.error}</>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Encode Mode */}
      {mode === 'encode' && (
        <div className="jwt-workspace">
          <div className="jwt-input-section">
            <label>Payload (JSON)</label>
            <textarea
              className="jwt-textarea"
              value={payloadInput}
              onChange={(e) => setPayloadInput(e.target.value)}
              rows={6}
            />
            <div className="encode-options">
              <div className="option-group">
                <label>Expires In</label>
                <input
                  type="text"
                  className="jwt-input small"
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                  placeholder="1h, 30m, 7d"
                />
              </div>
            </div>
          </div>

          {/* Secret / Key for signing */}
          <div className="jwt-secret-section">
            {isAsymmetric ? (
              <div className="key-inputs">
                <div className="key-group">
                  <label>Private Key (for signing)</label>
                  <textarea
                    className="jwt-textarea key-area"
                    placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    rows={4}
                  />
                </div>
                <button className="generate-keys-btn" onClick={handleGenerateKeys}>
                  Generate {algorithm} Key Pair
                </button>
              </div>
            ) : (
              algorithm !== 'none' && (
                <div className="secret-group">
                  <label>Secret</label>
                  <input
                    type="text"
                    className="jwt-input"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="your-secret-key"
                  />
                </div>
              )
            )}
          </div>

          <button className="jwt-action-btn encode-action-btn" onClick={handleEncode}>
            <MdLock /> Generate Token
          </button>

          {/* Encoded Output */}
          {encodedToken && (
            <div className="jwt-encoded-output">
              <div className="decoded-label">
                <span>GENERATED TOKEN</span>
                <button className="mini-copy" onClick={() => copyToClipboard(encodedToken, 'Token')}>
                  <MdContentCopy />
                </button>
              </div>
              <pre className="encoded-token">{encodedToken}</pre>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default JWTTool;
