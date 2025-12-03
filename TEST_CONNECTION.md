# Test Your Database Connection

## Quick Test Steps

### 1. Verify Backend is Running
- Check your terminal where you ran `npm run dev`
- Should see: `🚀 Server running on http://localhost:3000`
- Should see: `✅ Connected to MySQL database!`

### 2. Test API Endpoints

Open these URLs in your browser:

**Health Check:**
```
http://localhost:3000/api/health
```
Should return: `{"status":"OK",...}`

**Get Bookings:**
```
http://localhost:3000/api/bookings
```
Should return: `[]` (empty array - no bookings yet, but connection works!)

**Get Testimonials:**
```
http://localhost:3000/api/testimonials
```
Should return: `[]`

### 3. Test Angular Connection

1. **Start Angular** (if not running):
   ```cmd
   npm start
   ```

2. **Open browser:** `http://localhost:4200`

3. **Test these pages:**
   - Blog page: Should load (may be empty)
   - Gallery page: Should load (may be empty)
   - Testimonials page: Should load (may be empty)
   - Contact form: Try submitting - should work!

4. **Check browser console** (F12):
   - Look for any errors
   - Should see API calls to `http://localhost:3000/api/...`

### 4. Test Admin Panel

1. Go to: `http://localhost:4200/admin/login`
2. Login (use the default admin credentials if you set them up)
3. Check dashboard - should show stats (may be 0s if no data)

---

## If Everything Works:

✅ **Backend connected to MySQL** - You'll see data in API responses
✅ **Angular connected to API** - Pages load without errors
✅ **Full stack working** - You can add/view data through the website

---

## Common Issues:

### "Cannot GET /api/bookings"
- Backend not running - Start it with `npm run dev` in `silianos-backend` folder

### "Network Error" or CORS errors
- Backend not running on port 3000
- Check `http://localhost:3000/api/health` works first

### Empty pages but no errors
- This is normal! Database is empty
- Add data through admin panel or API

### Database connection error in backend
- Check `.env` file in `silianos-backend` folder
- Verify database name, user, password are correct

---

## Add Test Data (Optional)

You can add test data directly through MySQL or through the admin panel once logged in.






