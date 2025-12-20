import React, { useState } from 'react';
import ResultCard from '../components/ResultCard';

const SearchPage = () => {
  const [query, setQuery] = useState("");
  // Sample data to show you how it looks (Later this comes from MongoDB)
  const [results, setResults] = useState([
    {
      id: 1,
      name: "Maria Guerra",
      date: "30 Oct 1930",
      location: "Tegucigalpa, Honduras",
      imageUrl: "https://via.placeholder.com/400x200?text=Newspaper+Clipping+Sample",
    }
  ]);

  return (
    <div style={{ backgroundColor: '#EFE7DD', minHeight: '100vh', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#737958', fontSize: '2.5rem' }}>Recuerdos de Honduras</h1>
        <p style={{ color: '#ACA37E' }}>Digital Newspaper & Magazine Archive</p>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input 
            type="text" 
            placeholder="Search by name (e.g. Maria Guerra)" 
            style={{ 
              flex: 1, 
              padding: '12px', 
              border: '2px solid #ACA37E',
              backgroundColor: '#DDC6B2'
            }}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button style={{ backgroundColor: '#737958', color: 'white', padding: '0 20px', border: 'none' }}>
            Search
          </button>
        </div>

        <div className="results-grid">
          {results.map(record => (
            <ResultCard key={record.id} record={record} />
          ))}
        </div>
      </div>

      {/* Donation Footer */}
      <footer style={{ marginTop: '50px', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#E9CBCB', padding: '20px', borderRadius: '8px', display: 'inline-block' }}>
          <p style={{ color: '#737958', margin: '0 0 10px 0' }}>Help us digitize more Honduran history</p>
          {/* Your PayPal Button will go here */}
          <button style={{ backgroundColor: '#737958', color: 'white', border: 'none', padding: '10px 20px' }}>
            Donate via PayPal
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;