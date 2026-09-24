import React from 'react';
import { useSEO } from '../utils/useSEO';
import './LegalPages.css';

function PrivacyPolicy() {
  useSEO({
    title: 'Privacy Policy — Testovo',
    description: 'How Testovo handles data: tools run in your browser, no accounts, no stored personal data, approximate IP-based location for the address tool, and third-party advertising cookies.',
  });

  return (
    <main className="content-page">
      <h1>Privacy Policy</h1>
      <p className="content-updated">Last updated: September 24, 2026</p>

      <p>
        This Privacy Policy explains what information Testovo ("we", "us") processes when you use our
        website and its free online tools (the "Service"). We keep this deliberately simple because
        the Service is designed to collect as little as possible.
      </p>

      <h2>1. Information we do not collect</h2>
      <p>
        Testovo does not require you to create an account. We do not ask for, store, or sell your
        name, email, or the text and data you enter into the tools. Everything you type is processed
        locally in your browser and is not saved on our servers.
      </p>

      <h2>2. Approximate location detection</h2>
      <p>
        Our address generator tool may detect your approximate location to suggest a relevant default
        city, using third-party IP geolocation providers (such as ipapi.co and ip-api.com). This uses
        your IP address to estimate your city and country. We do not store this information; it is used
        only in your current browser session to pick a starting city. Other tools do not use location.
      </p>

      <h2>3. Cookies and advertising</h2>
      <p>
        The Service itself does not set tracking cookies. In the future, we may display advertisements
        through third-party ad networks (for example, Google AdSense). When enabled, such networks may
        use cookies or similar technologies to serve and measure ads, potentially based on your prior
        visits to this and other websites.
      </p>
      <div className="content-note">
        Advertising is not active yet. When it is enabled, this section will be updated with the
        specific ad partners in use, and you will be able to manage ad personalization through the
        respective provider's settings.
      </div>
      <p>
        You can learn how Google uses information from sites that use its services, and how to opt out
        of personalized advertising, at{' '}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
          Google's advertising policies
        </a>.
      </p>

      <h2>4. Third-party services</h2>
      <p>
        The Service relies on third-party providers for hosting, IP geolocation, and (in the future)
        advertising. These providers process data under their own privacy policies, which we do not
        control.
      </p>

      <h2>5. Children's privacy</h2>
      <p>
        The Service is intended for developers and general users and is not directed at children under
        13. We do not knowingly collect personal information from children.
      </p>

      <h2>6. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The "Last updated" date above reflects the
        most recent revision.
      </p>

      <h2>7. Contact</h2>
      <p>
        If you have questions about this Privacy Policy, please visit our{' '}
        <a href="/contact">Contact</a> page.
      </p>
    </main>
  );
}

export default PrivacyPolicy;
