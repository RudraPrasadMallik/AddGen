import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import TempAddress from './pages/TempAddress';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ToolsDirectory from './pages/ToolsDirectory';
import ToolPage from './pages/ToolPage';
import NotFound from './pages/NotFound';
import './App.css';

// ---------------------------------------------------------------------------
// Disabled features (backend-dependent) — re-enable when their phase arrives.
// ---------------------------------------------------------------------------
// import TempMail from './pages/TempMail';
// import PKCEGenerator from './pages/PKCEGenerator';
// import JWTTool from './pages/JWTTool';
// import WebhookTester from './pages/WebhookTester';
// import Base64Tool from './pages/Base64Tool';

function App() {
  return (
    <Router>
      <div className="app">
        <ScrollToTop />
        <Header />
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Home />} />

          {/* Random Address Generator (rich standalone tool) */}
          <Route path="/temp-address" element={<TempAddress />} />

          {/* Tools suite */}
          <Route path="/tools" element={<ToolsDirectory />} />
          <Route path="/tools/:slug" element={<ToolPage />} />

          {/* Informational / legal pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          {/* --- Disabled features (backend-dependent) ---
          <Route path="/temp-mail" element={<TempMail />} />
          <Route path="/pkce" element={<PKCEGenerator />} />
          <Route path="/jwt" element={<JWTTool />} />
          <Route path="/webhook" element={<WebhookTester />} />
          <Route path="/base64" element={<Base64Tool />} />
          --- */}

          {/* Unknown routes render a proper 404 page (avoids SEO soft-404s) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
