import React, { useState } from 'react';
import ResultCard from '../components/ResultCard';

const SearchPage = () => {
  // 'query' stores what you type. 'setQuery' updates it.
  const [query, setQuery] = useState("");
  
  // 'results' will eventually hold the real data from MongoDB
  const [results, setResults] = useState([
    {
      id: 1,
      name: "Maria Guerra",
      date: "30 Oct 1930",
      location: "Tegucigalpa, Honduras",
      imageUrl: "https://via.placeholder.com/400x200?text=Maria+Guerra+Snippet",
    }
  ]);

  const handleSearch = async () => {
    console.log("Searching for:", query); // Using 'query' here fixes the warning
    
    // This is where we will fetch the real data later:
    // const response = await fetch(`http://localhost:5000/api/search?name=${query}`);
    // const data = await response.json();
    // setResults(data); // Using 'setResults' here fixes the warning
  };

  return (
    <div style={{ backgroundColor: '#EFE7DD', minHeight: '100vh', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#737958' }}>Recuerdos de Honduras</h1>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
        <input 
          type="text" 
          value={query} // This links the input to our variable
          placeholder="Enter a surname..." 
          onChange={(e) => setQuery(e.target.value)} 
          style={{ padding: '12px', border: '2px solid #ACA37E', width: '300px' }}
        />
        <button 
          onClick={handleSearch} 
          style={{ backgroundColor: '#737958', color: 'white', padding: '12px 25px', border: 'none', cursor: 'pointer' }}
        >
          Search
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {results.map(record => (
          <ResultCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;