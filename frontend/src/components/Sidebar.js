import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ 
      width: '260px', backgroundColor: '#737958', color: '#EFE7DD', 
      height: '100vh', padding: '20px', position: 'fixed', overflowY: 'auto' 
    }}>
      <h2 style={{ fontFamily: 'serif', borderBottom: '1px solid #ACA37E' }}>ARCHIVE</h2>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <Link to="/" style={linkStyle}>🏠 Home / Search</Link>
        <Link to="/upload" style={linkStyle}>📤 Upload New File</Link>
        
        <hr style={{ borderColor: '#ACA37E', width: '100%' }} />
        
        <h3 style={headerStyle}>COLLECTIONS</h3>
        <Link to="/category/Portrait" style={linkStyle}>👤 Portraits</Link>
        <Link to="/category/News" style={linkStyle}>📰 News & Clippings</Link>
        
        <h3 style={headerStyle}>VITAL RECORDS</h3>
        <Link to="/type/DOB" style={linkStyle}>🍼 Births (DOB)</Link>
        <Link to="/type/Marriage" style={linkStyle}>💍 Marriages</Link>
        <Link to="/type/DOD" style={linkStyle}>⚰️ Deaths (DOD)</Link>
      </nav>

      <div style={{ marginTop: '30px' }}>
        <h3 style={headerStyle}>SURNAME INDEX</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px' }}>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => (
            <Link key={l} to={`/alpha/${l}`} style={{ color: '#EFE7DD', textDecoration: 'none', fontSize: '0.8rem' }}>{l}</Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const linkStyle = { color: '#EFE7DD', textDecoration: 'none', padding: '5px 0', fontSize: '1rem' };
const headerStyle = { fontSize: '0.8rem', color: '#ACA37E', marginTop: '15px', textTransform: 'uppercase' };

export default Sidebar;