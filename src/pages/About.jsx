import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../utils/useSEO';
import './LegalPages.css';

function About() {
  useSEO({
    title: 'About Testovo',
    description: 'Testovo is a free collection of browser-based tools for developers and testers — generators, converters, encoders, hashes, and text utilities. No signup, nothing stored.',
  });

  return (
    <main className="content-page">
      <h1>About Testovo</h1>

      <p>
        Testovo is a free, browser-based toolkit for developers, QA engineers, and testers. It brings
        together the small utilities you reach for every day — data generators, converters, encoders
        and decoders, minifiers, hash calculators, and text tools — in one fast, no-signup place.
      </p>

      <h2>What you can do</h2>
      <ul>
        <li>Generate test data: random addresses, passwords, UUIDs, numbers, colors, JSON, and more.</li>
        <li>Convert between formats and number bases, and prettify or minify JSON, CSS, HTML, and XML.</li>
        <li>Encode/decode Base64, URLs, and HTML entities, and compute common hashes.</li>
        <li>Work with text: count, sort, shuffle, find/replace, extract, and transform.</li>
      </ul>

      <h2>Runs entirely in your browser</h2>
      <p>
        Every tool runs locally in your browser. There is no account to create, and the text or data
        you enter is not uploaded to any server. That makes Testovo fast and privacy-friendly.
      </p>

      <div className="content-note">
        Any sample data Testovo generates — including addresses, phone numbers, and card numbers — is
        fictitious and intended for software testing and development only. It does not represent real
        people, and must not be used for fraud or deception.
      </div>

      <h2>What's next</h2>
      <p>
        We are actively adding more tools and plan to expand Testovo with software testing resources
        and practice questions. Have a request? Visit our <Link to="/contact">Contact</Link> page.
      </p>
    </main>
  );
}

export default About;
