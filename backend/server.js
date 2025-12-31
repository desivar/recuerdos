
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
require('dotenv').config();
// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/recuerdos'
  .then(() => console.log('✅ Database Connected'))
  .catch(err => console.error('❌ Database Error:', err));

// ========== SCHEMAS ==========

// User Schema (for admin and optional user accounts)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  whatsapp: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Record Schema (newspaper clippings, portraits, vital records)
const recordSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Portrait', 'News', 'Birth', 'Death', 'Marriage'],
    required: true 
  },
  recordType: String, // Birth, Death, Marriage (for vital records)
  eventDate: String, // Year or full date
  location: String, // City/Department in Honduras
  transcription: String, // Text content of the news/record
  imageUrl: String, // Path to uploaded image
  thumbnailUrl: String, // Optional cropped version
  pdfSource: String, // Link to original PDF
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Record = mongoose.model('Record', recordSchema);

// Contact Message Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// ========== FILE UPLOAD CONFIG ==========

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG) and PDF are allowed!'));
    }
  }
});

// ========== AUTHENTICATION ROUTES ==========

// Admin/User Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username, password });
    
    if (user) {
      res.json({ 
        success: true, 
        username: user.username,
        email: user.email,
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

// User Registration (optional for patrons)
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, whatsapp } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }
    
    const newUser = new User({
      username,
      email,
      password, // In production, hash this with bcrypt!
      whatsapp,
      role: 'user'
    });
    
    await newUser.save();
    res.json({ success: true, message: 'Account created successfully!', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Check if admin exists (for initial setup)
app.get('/api/check-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' });
    res.json({ hasAdmin: !!admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create initial admin (run once)
app.post('/api/create-admin', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    
    const admin = new User({
      username,
      email,
      password, // In production, hash with bcrypt
      role: 'admin'
    });
    
    await admin.save();
    res.json({ success: true, message: 'Admin created successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== RECORD ROUTES ==========

// Search/Filter Records
app.get('/api/search', async (req, res) => {
  try {
    const { name, category, recordType, letter } = req.query;
    let query = {};
    
    if (name) {
      query.fullName = { $regex: name, $options: 'i' };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (recordType) {
      query.recordType = recordType;
    }
    
    if (letter) {
      query.fullName = { $regex: '^' + letter, $options: 'i' };
    }
    
    const results = await Record.find(query).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single record by ID
app.get('/api/record/:id', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload new record (admin only - you'll need to verify role in production)
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
      recordType: recordType || category, // Use category if recordType not specified
      transcription,
      imageUrl: '/uploads/' + req.file.filename,
      pdfSource,
      uploadedBy: userId
    });
    
    await newRecord.save();
    res.json({ 
      success: true, 
      message: 'Record uploaded successfully!', 
      record: newRecord 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete record (admin only)
app.delete('/api/record/:id', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    // Delete image file if exists
    if (record.imageUrl) {
      const imagePath = path.join(__dirname, record.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Record.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== CONTACT ROUTES ==========

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, userId } = req.body;
    
    const newContact = new Contact({
      name,
      email,
      message,
      userId
    });
    
    await newContact.save();
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get contact messages (admin only)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).populate('userId', 'username email');
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== STATISTICS ==========

app.get('/api/stats', async (req, res) => {
  try {
    const totalRecords = await Record.countDocuments();
    const byCategory = await Record.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalRecords,
      byCategory
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== SERVER START ==========

// ========== SERVER START ==========

// process.env.PORT allows Render to tell the app which port to use
const PORT = process.env.PORT || 5000; 

// Adding '0.0.0.0' is a common requirement for cloud hosting to accept outside traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SERVER IS NOW ON PORT: ${PORT}`);
});