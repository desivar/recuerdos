🇭🇳 Recuerdos de Honduras - Digital Archive
Recuerdos de Honduras is a full-stack MERN application designed to archive and categorize historical documents, news clippings, and portraits related to Honduran heritage. The app features a searchable gallery, category filtering, and secure cloud-based image storage.

🚀 Live Demo
View the app here: https://recuerdos-4lm3.onrender.com
✨ Features
Full-Stack Integration: Built with the MERN (MongoDB, Express, React, Node.js) stack.

Dynamic Search: Filter records by full name, category, or specific surnames.

Cloud Image Hosting: Integrated with Cloudinary for reliable, high-performance image management.

Responsive Gallery: A clean, user-friendly interface for browsing historical records.

Historical Categorization: Specific tags for Portraits, Births, Deaths, and Marriages.

🛠️ Tech Stack
Frontend: React.js, CSS3.

Backend: Node.js, Express.js (v5).

Database: MongoDB Atlas.

Storage: Cloudinary API.

Deployment: Render.

📦 Installation & Setup
Clone the repository:

Bash

git clone https://github.com/desivar/recuerdos.git
Install dependencies:

Bash
# Install backend dependencies
cd backend && npm install
# Install frontend dependencies
cd ../frontend && npm install
Environment Variables: Create a .env file in the backend folder with:

MONGO_URI

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET

Run the app:

Bash

# From the root directory
npm run build --prefix frontend
node backend/server.js
📝 Lessons Learned
During the development of this project, I successfully navigated several complex deployment challenges:

Express 5 Migration: Updated wildcard routing to comply with the new path-to-regexp requirements (/*splat syntax).

Path Management: Implemented cross-directory static file serving to bridge the Node.js backend with the React build.

URI Encoding: Resolved database connection issues by properly escaping special characters in MongoDB connection strings.
