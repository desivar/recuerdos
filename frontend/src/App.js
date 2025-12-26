import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SearchPage from './pages/SearchPage';
import UploadPage from './pages/UploadPage';
import CollectionView from './pages/CollectionView'; // Import the missing view

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ marginLeft: '320px', flex: 1 }}>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<SearchPage />} />
            <Route path="/upload" element={<UploadPage />} />

            {/* Collection & Index Filters */}
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