import React, { useState } from 'react';
import axios from 'axios';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    eventDate: '',
    location: '',
    category: 'News', // Default category
    transcription: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('image', file);
    data.append('fullName', formData.fullName);
    data.append('eventDate', formData.eventDate);
    data.append('location', formData.location);
    data.append('category', formData.category);
    data.append('transcription', formData.transcription);

    try {
      await axios.post('http://localhost:5000/api/upload-snippet', data);
      alert("Success! The document is now in the archive.");
    } catch (err) {
      console.error(err);
      alert("Error: Make sure your backend server is running.");
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#EFE7DD', minHeight: '100vh' }}>
      <h2 style={{ color: '#737958' }}>Upload to Archive</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
        
        <input type="text" placeholder="Full Name of Person" required 
          onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
        
        <select onChange={(e) => setFormData({...formData, category: e.target.value})}>
          <option value="News">News / Clipping</option>
          <option value="Portrait">Portrait / Photo</option>
          <option value="Birth">Birth Record (DOB)</option>
          <option value="Death">Death Record (DOD)</option>
          <option value="Marriage">Marriage Certificate</option>
        </select>

        <input type="text" placeholder="Date (Year)" required 
          onChange={(e) => setFormData({...formData, eventDate: e.target.value})} />
        
        <input type="text" placeholder="Location (City/Dept)" required 
          onChange={(e) => setFormData({...formData, location: e.target.value})} />
        
        <textarea placeholder="Type transcription here..." rows="5"
          onChange={(e) => setFormData({...formData, transcription: e.target.value})} />

        <input type="file" accept="image/*" required 
          onChange={(e) => setFile(e.target.files[0])} />

        <button type="submit" style={{ backgroundColor: '#737958', color: 'white', padding: '12px', cursor: 'pointer' }}>
          SAVE TO DATABASE
        </button>
      </form>
    </div>
  );
};

export default UploadPage;