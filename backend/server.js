const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// 1. ADD THESE TWO IMPORTS
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// 2. CLOUDINARY CONFIG (Uses Environment Variables for Render)
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

// ========== SCHEMAS (Keep your existing schemas here) ==========
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
  imageUrl: String, // THIS WILL NOW STORE THE CLOUDINARY URL
  pdfSource: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
const Record = mongoose.model('Record', recordSchema);

// ========== NEW CLOUDINARY STORAGE CONFIG ==========
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'honduras_archive',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
  },
});

const upload = multer({ storage: storage });

// ========== ROUTES ==========

app.get('/', (req, res) => {
  res.send('Recuerdos de Honduras API is live!');
});

// 3. UPDATED UPLOAD ROUTE
app.post('/api/upload-snippet', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { fullName, eventDate, location, category, recordType, transcription, pdfSource, userId } = req.body;

    const newRecord = new Record({
      fullName,
      eventDate,
      location,
      category,
      recordType: recordType || category,
      transcription,
      imageUrl: req.file.path, // <--- CLOUDINARY PROVIDES THE FULL URL HERE
      pdfSource,
      uploadedBy: userId
    });

    await newRecord.save();
    res.json({ success: true, message: 'Record uploaded successfully!', record: newRecord });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. UPDATED DELETE ROUTE (Removed local file system logic)
app.delete('/api/record/:id', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });
    
    // Note: To delete from Cloudinary, you'd use cloudinary.uploader.destroy
    // For now, we just delete the database entry.
    await Record.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== MISSING ROUTES ==========

// Admin/User Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ 
        success: true, 
        username: user.username, 
        role: user.role, 
        userId: user._id 
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Search/Filter Records
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




// 1. Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// 2. This handles the visual website
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'frontend/build', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // If build folder is missing, show this message
    res.send('API is live, but frontend build was not found. Check your Render build command.');
  }
});

// ========== SERVER START ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SERVER IS NOW ON PORT: ${PORT}`);
});