import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MdContentCopy, MdSwapVert, MdDelete } from 'react-icons/md';
import { useSEO } from '../utils/useSEO';
import './Base64Tool.css';

function Base64Tool() {
  useSEO({
    title: 'Free Base64 Encoder & Decoder Online',
    description: 'Encode text to Base64 or decode Base64 strings back to plain text instantly. Supports Unicode characters. Free online Base64 tool for developers.',
  });
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleEncode = (text) => {
    setInput(text);
    setError('');
    if (!text) {
      setOutput('');
      return;
    }
    try {
      // Support Unicode characters
      const encoded = btoa(unescape(encodeURIComponent(text)));
      setOutput(encoded);
    } catch (err) {
      setError('Failed to encode');
      setOutput('');
    }
  };

  const handleDecode = (text) => {
    setInput(text);
    setError('');
    if (!text) {
      setOutput('');
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(text)));
      setOutput(decoded);
    } catch (err) {
      setError('Invalid Base64 string');
      setOutput('');
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    if (mode === 'encode') {
      handleEncode(text);
    } else {
      handleDecode(text);
    }
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError('');
  };

  const handleSwap = () => {
    // Swap input/output and toggle mode
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    const newInput = output;
    setMode(newMode);
    setInput(newInput);
    setError('');
    if (newMode === 'encode') {
      handleEncode(newInput);
    } else {
      handleDecode(newInput);
    }
  };

  const handleCopy = () => {
    if (!output) {
      toast.error('Nothing to copy');
      return;
    }
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <main className="base64-page">
      <div className="base64-header">
        <h1 className="base64-title">Base64 Encoder / Decoder</h1>
        <p className="base64-subtitle">
          Encode text to Base64 or decode Base64 back to text. Supports Unicode characters.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="base64-mode-toggle">
        <button
          className={`b64-mode-btn ${mode === 'encode' ? 'active' : ''}`}
          onClick={() => handleModeSwitch('encode')}
        >
          Encode
        </button>
        <button
          className={`b64-mode-btn ${mode === 'decode' ? 'active' : ''}`}
          onClick={() => handleModeSwitch('decode')}
        >
          Decode
        </button>
      </div>

      <div className="base64-workspace">
        {/* Input */}
        <div className="b64-panel">
          <div className="b64-panel-header">
            <span className="b64-panel-label">
              {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
            </span>
            <button className="b64-clear-btn" onClick={handleClear}>
              <MdDelete /> Clear
            </button>
          </div>
          <textarea
            className="b64-textarea"
            value={input}
            onChange={handleInputChange}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string to decode...'}
            rows={8}
          />
          <div className="b64-stats">
            {input.length} characters
          </div>
        </div>

        {/* Swap Button */}
        <div className="b64-swap-container">
          <button className="b64-swap-btn" onClick={handleSwap} title="Swap input/output">
            <MdSwapVert />
          </button>
        </div>

        {/* Output */}
        <div className="b64-panel">
          <div className="b64-panel-header">
            <span className="b64-panel-label">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
            </span>
            <button className="b64-copy-btn" onClick={handleCopy}>
              <MdContentCopy /> Copy
            </button>
          </div>
          <textarea
            className="b64-textarea output"
            value={error || output}
            readOnly
            rows={8}
            style={error ? { color: '#ef4444' } : {}}
          />
          <div className="b64-stats">
            {output.length} characters
          </div>
        </div>
      </div>
    </main>
  );
}

export default Base64Tool;
