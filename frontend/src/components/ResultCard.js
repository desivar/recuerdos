import React, { useState } from 'react';
import axios from 'axios';
import ResultCard from '../components/ResultCard';

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/search?name=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error("Database connection error:", error);
    }
  };

  return (
    <div style={{ backgroundColor: '#EFE7DD', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#737958', textAlign: 'center' }}>Recuerdos de Honduras</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
        <input 
          type="text" 
          placeholder="Search Surname..." 
          onChange={(e) => setQuery(e.target.value)} 
          style={{ padding: '10px', border: '1px solid #737958', width: '250px' }}
        />
        <button 
          onClick={handleSearch} 
          style={{ backgroundColor: '#737958', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
        >
          Search Archive
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {results.map((record) => (
          <ResultCard key={record._id} record={record} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;