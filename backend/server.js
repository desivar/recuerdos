const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// 1. FIX: Only one CORS middleware needed
app.use(cors()); 
app.use(express.json());

// 2. Connect to MongoDB (ADD THIS)
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// 3. USER SCHEMA (Login)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // TODO: Hash with bcrypt in production
});
const User = mongoose.model('User', UserSchema);

// 4. RECORD SCHEMA (ADD THIS - needed for search route)
const RecordSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  category: { type: String, enum: ['Portraits', 'News'] },
  recordType: { type: String, enum: ['DOB', 'DOD', 'Marriage'] },
  // Add other fields as needed
});
const Record = mongoose.model('Record', RecordSchema);

// 5. LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Username and password required" 
      });
    }
    
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ 
        success: true, 
        username: user.username,
        message: "Login successful"
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during login" 
    });
  }
});

// 6. SEARCH ROUTE (FIXED)
app.get('/api/search', async (req, res) => {
  try {
    const { name, category, recordType, letter } = req.query;
    let query = {};

    // Filter by Name (Search bar)
    if (name) query.fullName = { $regex: name, $options: 'i' };

    // Filter by Category (Portraits or News)
    if (category) query.category = category;

    // FIX: Changed 'category' to 'recordType' - was overwriting category filter
    if (recordType) query.recordType = recordType;

    // Filter by Alphabet (Surname Index) - FIXED: Check if both name and letter aren't provided
    if (letter && !name) {
      query.fullName = { $regex: `^${letter}`, $options: 'i' };
    }

    const results = await Record.find(query).limit(100); // Added limit for safety
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ 
      success: false,
      message: "Server error during search" 
    });
  }
});

// 7. UPLOAD ROUTE (PLACEHOLDER - ADD YOUR EXISTING CODE HERE)
app.post('/api/upload', async (req, res) => {
  // Your existing upload code here
  res.json({ message: "Upload endpoint" });
});

// 8. TEST ROUTE
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 9. Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// 10. Start server with dynamic port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});