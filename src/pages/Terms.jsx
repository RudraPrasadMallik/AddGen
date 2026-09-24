import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../utils/useSEO';
import './LegalPages.css';

function Terms() {
  useSEO({
    title: 'Terms of Service — Testovo',
    description: 'Terms of Service for Testovo, a free collection of online developer and testing tools. Any generated sample data is fictitious and for testing purposes only.',
  });

  return (
    <main className="content-page">
      <h1>Terms of Service</h1>
      <p className="content-updated">Last updated: September 24, 2026</p>

      <p>
        By accessing or using Testovo (the "Service"), you agree to these Terms of Service. If you do
        not agree, please do not use the Service.
      </p>

      <h2>1. Purpose of the Service</h2>
      <p>
        Testovo provides free online tools for developers and testers. Some tools generate random,
        fictitious sample data (such as addresses, phone numbers, and card numbers) intended for
        software testing, development, UI validation, and demonstration purposes only.
      </p>

      <div className="content-note">
        All generated addresses are fake and randomly produced. They do not correspond to real people,
        properties, or businesses. Do not use the generated data to impersonate, deceive, or cause harm.
      </div>

      <h2>2. Acceptable use</h2>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>Engage in fraud, deception, or any unlawful activity.</li>
        <li>Submit fabricated information where accurate information is legally required.</li>
        <li>Attempt to disrupt, overload, or reverse-engineer the Service.</li>
      </ul>

      <h2>3. No warranty</h2>
      <p>
        The Service is provided "as is" and "as available" without warranties of any kind, express or
        implied. We do not guarantee that the Service will be uninterrupted, error-free, or that the
        generated data will meet any particular requirement.
      </p>

      <h2>4. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Testovo and its operators shall not be liable for any
        direct, indirect, incidental, or consequential damages arising from your use of, or inability
        to use, the Service.
      </p>

      <h2>5. Third-party services and ads</h2>
      <p>
        The Service may use third-party providers (for example, IP geolocation) and may display
        advertisements from third-party ad networks. Those third parties operate under their own terms
        and privacy policies, which we do not control.
      </p>

      <h2>6. Changes to these terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Service after changes take
        effect constitutes acceptance of the revised Terms.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about these Terms? Visit our <Link to="/contact">Contact</Link> page.
      </p>
    </main>
  );
}

export default Terms;
