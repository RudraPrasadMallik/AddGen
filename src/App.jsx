import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import TempAddress from './pages/TempAddress';
import './App.css';

// ---------------------------------------------------------------------------
// PHASED RELEASE: Only the Temp Address feature is enabled for this release.
// Other features are temporarily disabled. Re-enable them by uncommenting the
// imports and routes below when their release phase arrives.
// ---------------------------------------------------------------------------
// import Home from './pages/Home';
// import TempMail from './pages/TempMail';
// import PKCEGenerator from './pages/PKCEGenerator';
// import JWTTool from './pages/JWTTool';
// import WebhookTester from './pages/WebhookTester';
// import Base64Tool from './pages/Base64Tool';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          {/* Temp Address is the landing page for this phased release */}
          <Route path="/" element={<TempAddress />} />
          <Route path="/temp-address" element={<TempAddress />} />

          {/* --- Disabled for phased release ---
          <Route path="/" element={<Home />} />
          <Route path="/temp-mail" element={<TempMail />} />
          <Route path="/pkce" element={<PKCEGenerator />} />
          <Route path="/jwt" element={<JWTTool />} />
          <Route path="/webhook" element={<WebhookTester />} />
          <Route path="/base64" element={<Base64Tool />} />
          --- */}

          {/* Any unknown route falls back to the Temp Address page */}
          <Route path="*" element={<Navigate to="/temp-address" replace />} />
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
