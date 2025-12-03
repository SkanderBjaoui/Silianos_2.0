# Complete Setup Guide - Database + API + Angular

## ✅ Step 1: Create the Database (DO THIS NOW!)

Since your server is running, you need to create the database tables.

### Quick Method:

1. **Open a NEW Command Prompt** (keep your server running)

2. **Navigate to project folder:**
   ```cmd
   cd "C:\Users\bjaou\Desktop\my projects\silianos_2.0\Silianos-ng"
   ```

3. **Run the SQL schema:**
   ```cmd
   "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe" -u root -p < database_schema.sql
   ```
   (Enter your MySQL root password)

   **OR** if you created `silianos_user`:
   ```cmd
   "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe" -u silianos_user -p silianos_voyage < database_schema.sql
   ```

4. **Verify it worked:**
   ```cmd
   "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe" -u root -p
   ```
   Then in MySQL:
   ```sql
   USE silianos_voyage;
   SHOW TABLES;
   ```
   You should see 8 tables!

---

## ✅ Step 2: Test Your API

Your backend server should already be running. Test it:

1. **Open browser:** `http://localhost:3000/api/health`
   - Should show: `{"status":"OK",...}`

2. **Test bookings:** `http://localhost:3000/api/bookings`
   - Should return: `[]` (empty array - no data yet)

---

## ✅ Step 3: Angular is Already Updated!

I've already updated your Angular code to:
- ✅ Use HttpClient to call the API
- ✅ Map database fields (snake_case) to Angular interfaces (camelCase)
- ✅ Update all components to handle Observables
- ✅ Add error handling

**Your Angular app should now connect to the API automatically!**

---

## ✅ Step 4: Test the Full Flow

1. **Start Angular dev server** (if not running):
   ```cmd
   npm start
   ```

2. **Make sure backend is running** (port 3000)

3. **Test in browser:**
   - Go to: `http://localhost:4200`
   - Navigate to different pages
   - Try submitting a contact form
   - Check admin dashboard

---

## 🔧 Troubleshooting

### "Cannot connect to API"
- Make sure backend is running on port 3000
- Check: `http://localhost:3000/api/health`

### "Database connection error"
- Check your `.env` file in `silianos-backend` folder
- Make sure MySQL is running
- Verify database exists: `SHOW DATABASES;`

### "Empty data / No bookings"
- This is normal! Database is empty
- Add data through admin panel or API directly

### CORS errors
- Backend already has CORS enabled
- If issues persist, check `server.js` has `app.use(cors())`

---

## 📝 Next Steps

1. ✅ Database created
2. ✅ API connected
3. ✅ Angular updated
4. ⏭️ Add some test data through admin panel
5. ⏭️ Test all features
6. ⏭️ Deploy to production

---

## 🗑️ Clean Up

The `backend-api-files` folder was just a template. You can delete it if you've copied all files to `silianos-backend`:

```cmd
rmdir /s "backend-api-files"
```

Or manually delete the folder.

---

## 🎉 You're Done!

Your website is now connected to MySQL database through the API!






