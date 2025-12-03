# Quick Database Setup - Run This Now!

Since your server is already running and connected to MySQL, you just need to create the database tables.

## Option 1: Using MySQL Command Line (Easiest)

1. **Open a NEW Command Prompt window** (keep your server running in the other one)

2. **Navigate to your project folder:**
   ```cmd
   cd "C:\Users\bjaou\Desktop\my projects\silianos_2.0\Silianos-ng"
   ```

3. **Find your MySQL path** (usually one of these):
   - `C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`
   - `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`

4. **Run the schema file:**
   ```cmd
   "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe" -u root -p < database_schema.sql
   ```
   (Enter your MySQL root password when prompted)

   **OR** if you created the `silianos_user`:
   ```cmd
   "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe" -u silianos_user -p silianos_voyage < database_schema.sql
   ```

## Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your server
3. Click **File → Open SQL Script**
4. Select `database_schema.sql` from your project folder
5. Click the **Execute** button (lightning bolt icon) or press `Ctrl + Shift + Enter`

## Option 3: Copy-Paste Method

1. Open `database_schema.sql` in Notepad
2. Copy ALL the content
3. Open MySQL Command Line Client (from Start Menu)
4. Enter your root password
5. Paste the SQL and press Enter

## Verify It Worked

After running the schema, test in MySQL:
```sql
USE silianos_voyage;
SHOW TABLES;
```

You should see 8 tables:
- admin_users
- bookings
- testimonials
- blog_posts
- contact_messages
- gallery_images
- services
- pricing_packages

## Test the API Connection

Once tables are created, test your API:
- Open browser: `http://localhost:3000/api/health`
- Should show: `{"status":"OK",...}`
- Try: `http://localhost:3000/api/bookings`
- Should return: `[]` (empty array - no bookings yet)

## Next: Update Components

After database is set up, components need to be updated to handle Observables. See the component update guide.






