const express = require('express'); 
const mongoose = require('mongoose');
 const cors = require('cors'); 
 const app = express();

app.use(cors()); app.use(express.json());

mongoose.connect('mongodb://localhost:27017/recuerdos') 
.then(() => console.log('Database Connected')) .catch(err => console.error(err));

const User = mongoose.model('User', 
  new mongoose.Schema({ username: { type: String, required: true, unique: true },
     password: { type: String, required: true } }));

const Record = mongoose.model('Record', new mongoose.Schema(
  { fullName: String, category: String, recordType: String }));

app.post('/api/login', 
  async (req, res) => {
     const { username, password } = req.body; const user = await User.findOne({ username, password }); if (user) { res.json({ success: true, username: user.username }); } else { res.status(401).json({ success: false }); } });

app.get('/api/search', async (req, res) => { 
  try { const { name, category, recordType, letter } = req.query; let query = {}; if (name) query.fullName = { $regex: name, $options: 'i' }; if (category) query.category = category; if (recordType) query.recordType = recordType; if (letter) query.fullName = { $regex: '^' + letter, $options: 'i' }; const results = await Record.find(query); res.json(results); } catch (err) { res.status(500).send(err); } });

app.listen(5000, () => console.log('Backend running on port 5000'));
