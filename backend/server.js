const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/recuerdos';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Database Connected'))
  .catch(err => console.error('❌ Database Error:', err));

// ========== SCHEMAS ==========
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  whatsapp: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const recordSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Portrait', 'News', 'News about Birth', 'News about Death', 'News about Marriage'],
    required: true 
  },
  recordType: String,
  eventDate: String,
  location: String,
  transcription: String,
  imageUrl: String,
  pdfSource: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
const Record = mongoose.model('Record', recordSchema);

// ========== STORAGE CONFIG ==========
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'honduras_archive',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
  },
});
const upload = multer({ storage: storage });

// ========== API ROUTES ==========

// Upload Route
app.post('/api/upload-snippet', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { fullName, eventDate, location, category, recordType, transcription, pdfSource, userId } = req.body;
    const newRecord = new Record({
      fullName, eventDate, location, category,
      recordType: recordType || category,
      transcription, imageUrl: req.file.path, pdfSource, uploadedBy: userId
    });
    await newRecord.save();
    res.json({ success: true, message: 'Record uploaded successfully!', record: newRecord });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Route
app.delete('/api/record/:id', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });
    await Record.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ success: true, username: user.username, role: user.role, userId: user._id });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Search Route
app.get('/api/search', async (req, res) => {
  try {
    const { name, category, letter } = req.query;
    let query = {};
    if (name) query.fullName = { $regex: name, $options: 'i' };
    if (category) query.category = category;
    if (letter) query.fullName = { $regex: '^' + letter, $options: 'i' };
    const results = await Record.find(query).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== FRONTEND BRIDGE ==========

// 1. Serve static files (using '..' to climb out of backend folder)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// 2. Handle visual website (Express 5 named wildcard syntax)
app.get('/*splat', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'frontend', 'build', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('API is live, but frontend build was not found. Please check Render Build Command.');
  }
});

// ========== SERVER START ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SERVER IS NOW ON PORT: ${PORT}`);
});