const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// 1. FIX THE NETWORK ERROR: Enable CORS
app.use(cors()); 
app.use(express.json());

// 2. USER SCHEMA (Add this for Login)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // For real use, hash this with bcrypt later
});
const User = mongoose.model('User', UserSchema);

// 3. LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.json({ success: true, username: user.username });
  } else {
    res.status(401).json({ success: false, message: "Invalid Credentials" });
  }
});

// ... your existing search and upload routes here ...

app.listen(5000, () => console.log('Backend running on port 5000'));

app.use(cors()); // This allows the Frontend to talk to the Backend
app.get('/api/search', async (req, res) => {
  try {
    const { name, category, recordType, letter } = req.query;
    let query = {};

    // 1. Filter by Name (Search bar)
    if (name) query.fullName = { $regex: name, $options: 'i' };

    // 2. Filter by Category (Portraits or News)
    if (category) query.category = category;

    // 3. Filter by Record Type (DOB, DOD, Marriage)
    if (recordType) query.category = recordType;

    // 4. Filter by Alphabet (Surname Index)
    if (letter) query.fullName = { $regex: `^${letter}`, $options: 'i' };

    const results = await Record.find(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});