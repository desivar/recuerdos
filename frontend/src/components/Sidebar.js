import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const user = localStorage.getItem('archiveUser');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('archiveUser');
    navigate('/login');
  };

  return (
    <div style={{ /* your existing styles */ }}>
      <h2>ARCHIVE</h2>
      <Link to="/" style={linkStyle}>🏠 Home</Link>
      
      {/* Only show Upload if logged in */}
      {user ? (
        <>
          <Link to="/upload" style={linkStyle}>📤 Upload New File</Link>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: '#EFE7DD', cursor: 'pointer' }}>
            🚪 Logout ({user})
          </button>
        </>
      ) : (
        <Link to="/login" style={linkStyle}>🔑 Admin Login</Link>
      )}
      
      {/* ... the rest of your collections and ABC index ... */}
    </div>
  );
};