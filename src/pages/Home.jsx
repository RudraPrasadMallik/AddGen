import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdLocationOn, MdArrowForward, MdShield, MdSpeed, MdDevices, MdVpnKey } from 'react-icons/md';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'temp-mail',
      icon: <MdEmail />,
      title: 'Temp Mail',
      description: 'Disposable email addresses. Receive real emails without revealing your identity.',
      color: '#6c63ff',
      gradient: 'linear-gradient(135deg, #6c63ff, #4834d4)',
      path: '/temp-mail',
      tag: 'Popular',
    },
    {
      id: 'temp-address',
      icon: <MdLocationOn />,
      title: 'Temp Address & Phone',
      description: 'Location-based fake addresses and phone numbers for form testing.',
      color: '#38b2ac',
      gradient: 'linear-gradient(135deg, #38b2ac, #0d9488)',
      path: '/temp-address',
      tag: 'Location Aware',
    },
    {
      id: 'pkce',
      icon: <MdVpnKey />,
      title: 'PKCE Generator',
      description: 'Generate code_verifier and code_challenge pairs for OAuth 2.0 flows.',
      color: '#e67e22',
      gradient: 'linear-gradient(135deg, #e67e22, #d35400)',
      path: '/pkce',
      tag: 'Security',
    },
  ];

  const features = [
    {
      icon: <MdShield />,
      title: 'No Sign Up',
      description: 'Use instantly. No accounts, no tracking.',
    },
    {
      icon: <MdSpeed />,
      title: 'Fast & Lightweight',
      description: 'Data generated in milliseconds. Zero lag.',
    },
    {
      icon: <MdDevices />,
      title: 'Built for Devs',
      description: 'Made for testers, QA, and developers.',
    },
  ];

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-badge">🛠️ Developer Toolkit</div>
        <h1 className="hero-title">
          Temporary Data,<br />
          <span className="highlight">Real Privacy.</span>
        </h1>
        <p className="hero-subtitle">
          Generate disposable emails, fake addresses, phone numbers, and security tokens — all in one place. No signup. No tracking.
        </p>
      </section>

      <section className="tools-section">
        <div className="tools-grid">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="tool-card"
              onClick={() => navigate(tool.path)}
            >
              <div className="tool-card-top" style={{ background: tool.gradient }}>
                <div className="tool-icon">{tool.icon}</div>
                <span className="tool-tag">{tool.tag}</span>
              </div>
              <div className="tool-card-body">
                <h3 className="tool-title">{tool.title}</h3>
                <p className="tool-description">{tool.description}</p>
                <div className="tool-action" style={{ color: tool.color }}>
                  <span>Open Tool</span>
                  <MdArrowForward />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="features">
        <div className="features-header">
          <h2>Why TestNest?</h2>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">{feature.icon}</div>
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
