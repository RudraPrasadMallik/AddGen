import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TempMail from './pages/TempMail';
import TempAddress from './pages/TempAddress';
import PKCEGenerator from './pages/PKCEGenerator';
import JWTTool from './pages/JWTTool';
import WebhookTester from './pages/WebhookTester';
import Base64Tool from './pages/Base64Tool';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/temp-mail" element={<TempMail />} />
          <Route path="/temp-address" element={<TempAddress />} />
          <Route path="/pkce" element={<PKCEGenerator />} />
          <Route path="/jwt" element={<JWTTool />} />
          <Route path="/webhook" element={<WebhookTester />} />
          <Route path="/base64" element={<Base64Tool />} />
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
