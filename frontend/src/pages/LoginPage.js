import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5500/api/login', form);
      localStorage.setItem('archiveUser', res.data.username); // Save session
      navigate('/');
      window.location.reload(); // Refresh to update Sidebar
    } catch (err) {
      alert("Login failed! Check your backend.");
    }
  };

  return (
    <div style={{ padding: '50px', backgroundColor: '#EFE7DD', minHeight: '100vh' }}>
      <div style={{ maxWidth: '300px', margin: 'auto', border: '1px solid #737958', padding: '20px' }}>
        <h2 style={{ color: '#737958' }}>Admin Access</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Username" 
            onChange={e => setForm({...form, username: e.target.value})} />
          <input type="password" placeholder="Password" 
            onChange={e => setForm({...form, password: e.target.value})} />
          <button type="submit" style={{ backgroundColor: '#737958', color: 'white', padding: '10px' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;