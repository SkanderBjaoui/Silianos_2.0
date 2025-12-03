# Database Setup Guide for Silianos Voyage Website

## Overview
This guide will help you set up a MySQL database server on a computer that's always connected to the internet, and connect it to your Angular website.

---

## Part 1: Database Server Setup

### Option A: MySQL (Recommended)

#### Step 1: Install MySQL Server

**Windows:**
1. Download MySQL Community Server from: https://dev.mysql.com/downloads/mysql/
2. Run the installer
3. Choose "Server only" installation
4. Set root password (remember this!)
5. Complete the installation

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**Linux (CentOS/RHEL):**
```bash
sudo yum install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
sudo mysql_secure_installation
```

#### Step 2: Configure MySQL for Remote Access

1. **Edit MySQL Configuration:**
   - Windows: Edit `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`
   - Linux: Edit `/etc/mysql/mysql.conf.d/mysqld.cnf` or `/etc/my.cnf`

2. **Find and modify these lines:**
   ```ini
   bind-address = 0.0.0.0  # Change from 127.0.0.1 to allow remote connections
   port = 3306
   ```

3. **Restart MySQL:**
   - Windows: Services → MySQL → Restart
   - Linux: `sudo systemctl restart mysql`

#### Step 3: Create Database User and Grant Permissions

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE silianos_voyage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (replace 'your_password' with a strong password)
CREATE USER 'silianos_user'@'%' IDENTIFIED BY 'your_strong_password_here';

-- Grant all privileges
GRANT ALL PRIVILEGES ON silianos_voyage.* TO 'silianos_user'@'%';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

#### Step 4: Configure Firewall

**Windows Firewall:**
1. Windows Defender Firewall → Advanced Settings
2. Inbound Rules → New Rule
3. Port → TCP → 3306
4. Allow connection → Apply to all profiles
5. Name: "MySQL Server"

**Linux (UFW):**
```bash
sudo ufw allow 3306/tcp
sudo ufw reload
```

**Linux (firewalld):**
```bash
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
```

#### Step 5: Find Your Server's IP Address

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Linux:**
```bash
ip addr show
# or
hostname -I
```

**For External Access:**
- If accessing from outside your network, you'll need your public IP
- Check at: https://whatismyipaddress.com/
- You may need to configure port forwarding on your router (port 3306)

---

### Option B: PostgreSQL (Alternative)

If you prefer PostgreSQL:

**Installation:**
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
```

**Configuration:**
1. Edit `/etc/postgresql/14/main/postgresql.conf`:
   ```
   listen_addresses = '*'
   port = 5432
   ```

2. Edit `/etc/postgresql/14/main/pg_hba.conf`:
   ```
   host    all             all             0.0.0.0/0               md5
   ```

3. Create database and user:
```sql
sudo -u postgres psql
CREATE DATABASE silianos_voyage;
CREATE USER silianos_user WITH PASSWORD 'your_strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE silianos_voyage TO silianos_user;
\q
```

---

## Part 2: Database Schema (SQL)

Run this SQL script to create all required tables:

```sql
-- Use the database
USE silianos_voyage;

-- ============================================
-- 1. ADMIN USERS TABLE
-- ============================================
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    destination VARCHAR(200),
    departure_date DATE NOT NULL,
    return_date DATE,
    number_of_travelers INT NOT NULL DEFAULT 1,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_status ENUM('pending', 'approved', 'paid', 'failed') DEFAULT 'pending',
    total_amount DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_customer_email (email),
    INDEX idx_departure_date (departure_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. TESTIMONIALS TABLE
-- ============================================
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_image VARCHAR(500),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    service VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_verified (verified),
    INDEX idx_rating (rating),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. BLOG POSTS TABLE
-- ============================================
CREATE TABLE blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    image VARCHAR(500),
    author VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_date (date),
    INDEX idx_author (author),
    FULLTEXT idx_search (title, excerpt, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. GALLERY IMAGES TABLE
-- ============================================
CREATE TABLE gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    image VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. SERVICES TABLE
-- ============================================
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    about TEXT,
    image VARCHAR(500),
    icon VARCHAR(50),
    color VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    benefits JSON,
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. PRICING PACKAGES TABLE
-- ============================================
CREATE TABLE pricing_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'TND',
    period VARCHAR(50),
    image VARCHAR(500),
    badge VARCHAR(50),
    features JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT ADMIN USER
-- ============================================
-- Password: admin123 (change this immediately!)
-- Use bcrypt hash in production: $2b$10$...
INSERT INTO admin_users (username, email, password_hash, full_name) 
VALUES ('admin', 'admin@silianos.com', '$2b$10$rOzJ8KqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Administrator');

-- Note: Replace the password_hash above with a proper bcrypt hash
-- You can generate one using: https://bcrypt-generator.com/
-- Or in Node.js: const bcrypt = require('bcrypt'); bcrypt.hash('your_password', 10)
```

---

## Part 3: Connection Information for Your Website

You'll need to provide these details to connect your Angular website to the database:

### Database Connection Details:
```
Host: [Your Server IP Address] (e.g., 192.168.1.100 or your-public-ip.com)
Port: 3306 (MySQL) or 5432 (PostgreSQL)
Database Name: silianos_voyage
Username: silianos_user
Password: [The password you set]
```

### Security Notes:
1. **Never expose database credentials in frontend code!**
2. You need a **backend API** (Node.js, PHP, Java Spring Boot, etc.) to connect Angular to the database
3. The backend API will handle all database operations
4. Your Angular app will call the backend API endpoints

---

## Part 4: Backend API Setup (Required)

Since Angular runs in the browser, you **cannot** connect directly to MySQL. You need a backend API.

### Option 1: Node.js + Express (Recommended for Angular)

**Install Node.js:**
- Download from: https://nodejs.org/
- Install on your server

**Create API Project:**
```bash
mkdir silianos-api
cd silianos-api
npm init -y
npm install express mysql2 cors dotenv bcrypt jsonwebtoken
npm install -D nodemon
```

**Basic server.js structure:**
```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Example endpoint: Get bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example endpoint: Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { customer_name, email, phone, service_type, departure_date, number_of_travelers } = req.body;
    const [result] = await pool.query(
      'INSERT INTO bookings (customer_name, email, phone, service_type, departure_date, number_of_travelers) VALUES (?, ?, ?, ?, ?, ?)',
      [customer_name, email, phone, service_type, departure_date, number_of_travelers]
    );
    res.json({ id: result.insertId, message: 'Booking created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
```

**Create .env file:**
```
DB_HOST=localhost
DB_USER=silianos_user
DB_PASSWORD=your_strong_password_here
DB_NAME=silianos_voyage
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

### Option 2: Java Spring Boot (If using Tomcat)

If you want to use Tomcat, you'll need a Java backend:

1. Create Spring Boot project
2. Add MySQL connector dependency
3. Configure `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/silianos_voyage
spring.datasource.username=silianos_user
spring.datasource.password=your_strong_password_here
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

---

## Part 5: Update Your Angular Service

Once your backend API is running, update `src/app/services/data.service.ts` to call your API instead of using mock data:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://your-server-ip:3000/api'; // Your backend API URL

  constructor(private http: HttpClient) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings`);
  }

  addBooking(booking: Partial<Booking>): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, booking);
  }

  // ... other methods
}
```

---

## Part 6: Security Checklist

- [ ] Use strong passwords for database users
- [ ] Enable SSL/TLS for database connections
- [ ] Use environment variables for credentials (never hardcode)
- [ ] Implement authentication/authorization in your API
- [ ] Use HTTPS for API endpoints
- [ ] Regularly backup your database
- [ ] Keep MySQL/PostgreSQL updated
- [ ] Restrict database access to specific IPs if possible
- [ ] Use prepared statements to prevent SQL injection
- [ ] Implement rate limiting on API endpoints

---

## Part 7: Testing the Connection

**Test MySQL connection from command line:**
```bash
mysql -h your-server-ip -u silianos_user -p silianos_voyage
```

**Test from another computer:**
```bash
telnet your-server-ip 3306
```

If connection works, you'll see MySQL responding.

---

## Quick Reference

### Database Credentials Template:
```
Host: [YOUR_SERVER_IP]
Port: 3306
Database: silianos_voyage
Username: silianos_user
Password: [YOUR_PASSWORD]
```

### API Endpoint Template:
```
http://[YOUR_SERVER_IP]:3000/api
```

### Next Steps:
1. ✅ Install MySQL/PostgreSQL
2. ✅ Run the SQL schema script
3. ✅ Configure firewall
4. ✅ Set up backend API (Node.js/Spring Boot)
5. ✅ Update Angular service to use API
6. ✅ Test connection
7. ✅ Deploy!

---

## Need Help?

Common issues:
- **Can't connect remotely**: Check firewall and bind-address
- **Access denied**: Verify user permissions
- **Connection timeout**: Check network and port forwarding
- **SSL errors**: Configure SSL certificates or disable SSL requirement for development






