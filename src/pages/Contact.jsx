import React from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import { useSEO } from '../utils/useSEO';
import './LegalPages.css';

function Contact() {
  useSEO({
    title: 'Contact Testovo',
    description: 'Get in touch with the Testovo team for questions, feedback, or feature requests about our free developer and testing tools.',
  });

  return (
    <main className="content-page">
      <h1>Contact Us</h1>
      <p>
        Have a question, found an issue, or want to suggest a feature? We would love to hear from you.
        Reach out using the details below and we will get back to you as soon as we can.
      </p>

      <div className="contact-card">
        <div className="contact-row">
          <MdEmail />
          <span>Email: <a href="mailto:testovo.tools@gmail.com">testovo.tools@gmail.com</a></span>
        </div>
        <div className="contact-row">
          <MdLocationOn />
          <span>Hyderabad, Telangana, India</span>
        </div>
      </div>

      <p style={{ marginTop: '1.2rem' }}>
        For details on how we handle data, see our <Link to="/privacy-policy">Privacy Policy</Link>.
      </p>
    </main>
  );
}

export default Contact;
