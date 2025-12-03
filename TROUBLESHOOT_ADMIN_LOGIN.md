# Troubleshooting Admin Login – MongoDB Setup

If you see “Invalid credentials” when logging into the admin dashboard, work through the checklist below.

---

## Step 1 · Make sure MongoDB is running

### Option A · Run the helper script
1. Double‑click `check_database_status.bat`
2. It will check the **MongoDB** Windows service and run `test_mongodb_connection.js`

### Option B · Manual check
1. Press **Win + R**, type `services.msc`, press Enter
2. Find the **MongoDB** service
3. Status must be **Running**. If not, right‑click → **Start** (or run `net start MongoDB` in an elevated PowerShell)

---

## Step 2 · Test the DB connection + admin collection

1. Open a terminal in `silianos-backend`
2. Run:
   ```bash
   node test_mongodb_connection.js
   ```
3. Make sure the output shows:
   - ✅ Connected to MongoDB
   - ✅ `admin_users` collection listed

If it fails, double‑check `MONGODB_URI` in `.env` and that MongoDB is reachable (LAN IP / credentials).

---

## Step 3 · Confirm `.env` configuration

`silianos-backend/.env` must contain something like:

```env
MONGODB_URI=mongodb://admin:YourPassword@192.168.1.14:27017/silianos_voyage?authSource=admin
PORT=3000
JWT_SECRET=your_secret_here
```

Tips:
- Passwords with special characters must be URL‑encoded (e.g. `@` → `%40`)
- Restart the backend whenever `.env` is changed

---

## Step 4 · Verify the admin account in MongoDB

1. Open `mongosh` (or the shell inside MongoDB Compass):
   ```bash
   mongosh "mongodb://admin:YourPassword@192.168.1.14:27017/admin"
   ```
2. Switch to the app DB and query the collection:
   ```javascript
   use silianos_voyage
   db.admin_users.find({}, { username: 1, email: 1, is_active: 1 })
   ```
3. Ensure `SilianosAdmin` exists and `is_active: true`

To update/create an admin user:
```javascript
db.admin_users.updateOne(
  { username: "SilianosAdmin" },
  {
    $set: {
      email: "admin@silianos.com",
      full_name: "Silianos Administrator",
      is_active: true,
      password_hash: "<bcrypt-hash>"
    }
  },
  { upsert: true }
)
```
(Generate hashes with the backend helper script or `bcrypt` in Node.)

---

## Step 5 · Start the backend and check logs

```bash
cd silianos-backend
npm run dev
```

Look for:
```
✅ Connected to MongoDB database!
🚀 Server running on http://localhost:3000
```

Test the health endpoint: `http://localhost:3000/api/health`

---

## Step 6 · Test the admin login

### Using the frontend
- Navigate to `/admin/login`
- Username: `SilianosAdmin`
- Password: whatever you set during the Mongo step

### Using cURL/Postman
```bash
curl -X POST http://localhost:3000/api/auth/admin/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"SilianosAdmin\",\"password\":\"YourPassword\"}"
```

---

## Common issues & fixes

| Symptom | Fix |
| --- | --- |
| `Error: MongoDB connection failed` | MongoDB service stopped, wrong IP/port, firewall, or bad URI |
| `Invalid credentials` | Admin user missing/inactive, password hash outdated |
| `401` on auth routes | Missing `Authorization` header or expired token |
| Frontend can’t reach backend | Backend not running or CORS/network issues |

---

## Quick checklist

- [ ] MongoDB service is running
- [ ] `node test_mongodb_connection.js` succeeds
- [ ] `silianos-backend/.env` has a valid `MONGODB_URI`
- [ ] `admin_users` collection contains `SilianosAdmin`
- [ ] Backend (`npm run dev`) shows successful MongoDB connection
- [ ] `http://localhost:3000/api/health` returns OK
- [ ] Frontend points to the correct API URL

---

Need more help?  
Provide:
1. Output of `node test_mongodb_connection.js`
2. Backend console logs
3. Browser console / network errors (if any)



