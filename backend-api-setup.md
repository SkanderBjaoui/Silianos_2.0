# Backend API Setup Guide for Silianos Voyage

## Overview
This guide will help you create a Node.js/Express backend API that connects to your MySQL database.

---

## Step 1: Create Backend Project

1. Create a new folder for your backend (outside your Angular project):
   ```cmd
   cd "C:\Users\bjaou\Desktop\my projects\silianos_2.0"
   mkdir silianos-backend
   cd silianos-backend
   ```

2. Initialize Node.js project:
   ```cmd
   npm init -y
   ```

---

## Step 2: Install Dependencies

```cmd
npm install express mysql2 cors dotenv bcrypt jsonwebtoken
npm install -D nodemon
```

**Dependencies explained:**
- `express` - Web framework
- `mysql2` - MySQL driver
- `cors` - Enable CORS for Angular
- `dotenv` - Environment variables
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `nodemon` - Auto-restart on file changes (dev only)

---

## Step 3: Project Structure

Create these files and folders:

```
silianos-backend/
├── .env
├── .gitignore
├── package.json
├── server.js
├── config/
│   └── database.js
├── routes/
│   ├── auth.js
│   ├── bookings.js
│   ├── testimonials.js
│   ├── blog.js
│   ├── messages.js
│   ├── gallery.js
│   ├── services.js
│   └── pricing.js
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   ├── testimonialController.js
│   ├── blogController.js
│   ├── messageController.js
│   ├── galleryController.js
│   ├── serviceController.js
│   └── pricingController.js
└── middleware/
    └── auth.js
```

---

## Step 4: Configuration Files

### .env (Environment Variables)
```
# Database Configuration
DB_HOST=localhost
DB_USER=silianos_user
DB_PASSWORD=your_password_here
DB_NAME=silianos_voyage
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (change this to a random string!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### .gitignore
```
node_modules/
.env
*.log
.DS_Store
```

---

## Step 5: Database Connection

### config/database.js
```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'silianos_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'silianos_voyage',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL database!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
  });

module.exports = pool;
```

---

## Step 6: Main Server File

### server.js
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/services', require('./routes/services'));
app.use('/api/pricing', require('./routes/pricing'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Silianos Voyage API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});
```

---

## Step 7: Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

---

## Step 8: Create Routes and Controllers

I'll create all the route and controller files for you. See the next files...

---

## Step 9: Run the Server

```cmd
npm run dev
```

You should see:
```
✅ Connected to MySQL database!
🚀 Server running on http://localhost:3000
📡 API endpoints available at http://localhost:3000/api
```

---

## Step 10: Test the API

Open browser or use Postman:
- Health check: `http://localhost:3000/api/health`
- Get bookings: `http://localhost:3000/api/bookings`

---

## Next Steps

1. ✅ Backend API created
2. ✅ Connected to MySQL
3. ⏭️ Update Angular DataService to use API endpoints
4. ⏭️ Test all endpoints
5. ⏭️ Deploy backend to your server






