const mongoose = require('mongoose');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/recuerdos')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    createAdmin();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

async function createAdmin() {
  console.log('\n========================================');
  console.log('   ADMIN ACCOUNT CREATION');
  console.log('========================================\n');

  // Check if admin already exists
  const existingAdmin = await User.findOne({ role: 'admin' });
  
  if (existingAdmin) {
    console.log('⚠️  An admin account already exists!');
    console.log(`   Username: ${existingAdmin.username}`);
    console.log(`   Email: ${existingAdmin.email}\n`);
    
    rl.question('Do you want to create another admin? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
        console.log('\nExiting...');
        rl.close();
        mongoose.connection.close();
        return;
      }
      
      await promptForCredentials();
    });
  } else {
    await promptForCredentials();
  }
}

async function promptForCredentials() {
  rl.question('Enter admin username: ', (username) => {
    rl.question('Enter admin email: ', (email) => {
      rl.question('Enter admin password: ', async (password) => {
        
        // Validate inputs
        if (!username || !email || !password) {
          console.log('\n❌ All fields are required!');
          rl.close();
          mongoose.connection.close();
          return;
        }

        if (password.length < 6) {
          console.log('\n❌ Password must be at least 6 characters!');
          rl.close();
          mongoose.connection.close();
          return;
        }

        try {
          // Check if username or email already exists
          const existingUser = await User.findOne({
            $or: [{ username }, { email }]
          });

          if (existingUser) {
            console.log('\n❌ Username or email already exists!');
            rl.close();
            mongoose.connection.close();
            return;
          }

          // Create admin user
          const admin = new User({
            username,
            email,
            password, // Note: In production, hash this with bcrypt!
            role: 'admin'
          });

          await admin.save();

          console.log('\n========================================');
          console.log('✅ Admin account created successfully!');
          console.log('========================================');
          console.log(`Username: ${username}`);
          console.log(`Email: ${email}`);
          console.log(`Role: admin`);
          console.log('\nYou can now log in to the application!');
          console.log('========================================\n');

        } catch (err) {
          console.error('\n❌ Error creating admin:', err.message);
        } finally {
          rl.close();
          mongoose.connection.close();
        }
      });
    });
  });
}

// Handle readline close
rl.on('close', () => {
  process.exit(0);
});