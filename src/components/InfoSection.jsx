import React from 'react';
import { MdSecurity, MdTimer, MdDeleteForever, MdLightbulb, MdCheckCircle } from 'react-icons/md';
import './InfoSection.css';

function InfoSection() {
  return (
    <section className="info-section">
      <div className="info-header">
        <MdLightbulb className="info-header-icon" />
        <h2 className="info-title">How It Works & Your Security</h2>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <div className="info-card-icon usage">
            <MdCheckCircle />
          </div>
          <h3>How to Use</h3>
          <ul className="info-list">
            <li>A temporary email is generated instantly when you visit</li>
            <li>Copy the email and use it on any website that requires registration</li>
            <li>Incoming messages appear in your inbox automatically</li>
            <li>Click "New Email" anytime to get a fresh address</li>
          </ul>
        </div>

        <div className="info-card">
          <div className="info-card-icon where">
            <MdLightbulb />
          </div>
          <h3>Where to Use</h3>
          <ul className="info-list">
            <li>Sign up for free trials without revealing your real email</li>
            <li>Register on forums, social media, or services you don't trust</li>
            <li>Receive OTPs and verification codes safely</li>
            <li>Avoid spam from newsletters and marketing emails</li>
            <li>Test your own applications during development</li>
          </ul>
        </div>

        <div className="info-card">
          <div className="info-card-icon security">
            <MdSecurity />
          </div>
          <h3>Your Data is Safe</h3>
          <ul className="info-list">
            <li>All inbox data is permanently deleted from our database</li>
            <li>Click "Clear" to manually delete all your data instantly</li>
            <li>No personal information is ever stored or shared</li>
            <li>We do not track, log, or sell any user data</li>
          </ul>
        </div>

        <div className="info-card">
          <div className="info-card-icon auto-delete">
            <MdTimer />
          </div>
          <h3>Auto-Delete Policy</h3>
          <ul className="info-list">
            <li>If you don't clear manually, all inbox data is <strong>automatically deleted after 10 minutes</strong></li>
            <li>Once deleted, data is permanently removed — no recovery possible</li>
            <li>This ensures no trace of your activity remains on our servers</li>
            <li>Your privacy is guaranteed even if you forget to clear</li>
          </ul>
        </div>
      </div>

      <div className="info-notice">
        <MdDeleteForever className="notice-icon" />
        <p>
          <strong>Important:</strong> All inbox data is permanently erased from our database — 
          either instantly when you click "Clear", or automatically within 5–10 minutes. 
          This is irreversible and ensures complete privacy for every user.
        </p>
      </div>
    </section>
  );
}

export default InfoSection;
