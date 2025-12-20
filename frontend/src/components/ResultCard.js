const ResultCard = ({ record }) => {
  // We include sourceUrl here to use it below
  const { name, date, location, imageUrl, sourceUrl } = record;

  return (
    <div style={{ backgroundColor: '#DDC6B2', border: '1px solid #737958', padding: '15px', marginBottom: '20px' }}>
      <img src={imageUrl} alt={name} style={{ width: '100%' }} />
      <div style={{ backgroundColor: '#EFE7DD', padding: '10px' }}>
        <h3>{name}</h3>
        <p>{date} - {location}</p>
        
        {/* Using sourceUrl here makes the warning go away! */}
        {sourceUrl && (
          <a href={sourceUrl} target="_blank" rel="noreferrer" style={{ color: '#737958', fontSize: '0.8rem' }}>
            View Original Document
          </a>
        )}
      </div>
    </div>
  );
};