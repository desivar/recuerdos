import React from 'react';

const ResultCard = ({ record }) => {
  const { name, date, location, imageUrl, sourceUrl } = record;

  // Professional Genealogical Citation
  const citation = `${name}, ${date}, ${location}. Honduras Digital Archive (${window.location.href}).`;

  const downloadWithCitation = () => {
    navigator.clipboard.writeText(citation);
    alert("Citation copied to clipboard!");
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${name}_${date}.jpg`;
    link.click();
  };

  return (
    <div style={{ 
      backgroundColor: '#DDC6B2', 
      border: '1px solid #737958', 
      padding: '15px', 
      borderRadius: '4px',
      marginBottom: '20px' 
    }}>
      {/* The Newspaper Clipping Snippet */}
      <img src={imageUrl} alt={name} style={{ width: '100%', borderRadius: '2px' }} />
      
      <div style={{ backgroundColor: '#EFE7DD', padding: '10px', marginTop: '10px' }}>
        <h3 style={{ color: '#737958', margin: '0 0 5px 0' }}>{name}</h3>
        <p style={{ fontSize: '0.9rem', margin: '2px 0' }}>📅 {date}</p>
        <p style={{ fontSize: '0.9rem', margin: '2px 0' }}>📍 {location}</p>
        
        <button 
          onClick={downloadWithCitation}
          style={{ 
            backgroundColor: '#E9CBCB', 
            color: '#737958', 
            border: 'none', 
            padding: '8px 12px', 
            marginTop: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Download & Copy Citation
        </button>
      </div>
    </div>
  );
};

export default ResultCard;