import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure you installed this!
import ResultCard from '../components/ResultCard';

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); // Start with an empty list

  const handleSearch = async () => {
    try {
      // This calls your REAL backend we built earlier
      const response = await axios.get(`http://localhost:5000/api/search?name=${query}`);
      
      // Using setResults here makes the warning go away!
      setResults(response.data); 
    } catch (error) {
      console.error("Error fetching from database:", error);
    }
  };

  return (
    <div style={{ backgroundColor: '#EFE7DD', minHeight: '100vh', padding: '20px' }}>
      <input 
        type="text" 
        placeholder="Search Real Records..." 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <button onClick={handleSearch}>Search Archive</button>

      <div>
        {results.length > 0 ? (
          results.map(record => <ResultCard key={record._id} record={record} />)
        ) : (
          <p>No real records found yet. Try uploading one!</p>
        )}
      </div>
    </div>
  );
};