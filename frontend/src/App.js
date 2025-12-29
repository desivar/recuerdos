import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SearchPage from './pages/SearchPage';
import UploadPage from './pages/UploadPage';
import CollectionView from './pages/CollectionView';
import RecordDetail from './pages/RecordDetail';
import Login from './pages/LoginPage';
import Register from './pages/Register';
import Contact from './pages/Contact';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar user={user} onLogout={handleLogout} />
        
        <div style={{ 
          marginLeft: '300px', 
          flex: 1,
          minHeight: '100vh'
        }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SearchPage />} />
            <Route path="/record/:id" element={<RecordDetail />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/upload" element={<UploadPage />} />

            {/* Collection & Filter Routes */}
            <Route path="/category/:value" element={<CollectionView type="category" />} />
            <Route path="/type/:value" element={<CollectionView type="recordType" />} />
            <Route path="/alpha/:value" element={<CollectionView type="letter" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;