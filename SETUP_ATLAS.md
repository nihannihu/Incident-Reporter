# 🌐 MongoDB Atlas Setup Guide

## ✅ What You Have:
- ✅ MongoDB installed
- ✅ MongoDB Shell installed  
- ✅ MongoDB Atlas account
- ✅ MongoDB Database Tools installed (in `./mongodb-tools/`)

---

## 🎯 Get Your Atlas Connection String

### Step 1: Login to MongoDB Atlas
1. Go to: https://cloud.mongodb.com/
2. Login with your credentials

### Step 2: Get Connection String
1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Select:
   - Driver: **Node.js**
   - Version: **5.5 or later**
4. Copy the connection string

### Step 3: Your Connection String Should Look Like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 4: Modify It:
1. Replace `<username>` with your actual username
2. Replace `<password>` with your actual password
3. Add database name at the end: `/incident-reporting`

**Final format:**
```
mongodb+srv://myusername:MyPassword123@cluster0.abc123.mongodb.net/incident-reporting?retryWrites=true&w=majority
```

---

## 📝 Update .env File

### Option 1: Manual Update (Recommended)
1. Open `.env` file in this project
2. Find this line:
   ```
   MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/incident-reporting?retryWrites=true&w=majority
   ```
3. Replace with your actual connection string

### Option 2: Use Helper Script
Run this command and paste your connection string:
```bash
node update-atlas-uri.js
```

---

## ⚠️ Important Notes

### Special Characters in Password
If your password contains special characters, you need to URL-encode them:

| Character | Replace With |
|-----------|--------------|
| @ | %40 |
| : | %3A |
| / | %2F |
| # | %23 |
| ? | %3F |
| & | %26 |
| = | %3D |
| + | %2B |
| $ | %24 |
| , | %2C |
| space | %20 |

**Example:**
- Password: `My@Pass#123`
- Encoded: `My%40Pass%23123`

### Whitelist Your IP Address
1. In Atlas Dashboard, go to **Network Access**
2. Click **"Add IP Address"**
3. Choose:
   - **"Allow Access from Anywhere"** (0.0.0.0/0) - for testing
   - OR add your specific IP address
4. Click **Confirm**

---

## 🧪 Test Your Connection

### Test 1: Using MongoDB Shell
```bash
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/incident-reporting"
```

If successful, you'll see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb+srv://...
Using MongoDB: 7.0.x
✅ Connected!
```

### Test 2: Test Backup
```bash
npm run backup:atlas
```

If successful, you'll see:
```
🔄 Starting backup from local to MongoDB Atlas...
✅ Local backup completed successfully!
🌐 Uploading to MongoDB Atlas...
✅ Backup to Atlas completed successfully!
☁️  Your data is now backed up in the cloud!
```

---

## 🎉 Verification Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created (free M0 tier)
- [ ] Database user created
- [ ] IP address whitelisted (0.0.0.0/0 or your IP)
- [ ] Connection string copied
- [ ] Special characters in password URL-encoded
- [ ] Database name added to connection string (`/incident-reporting`)
- [ ] `.env` file updated with `MONGODB_ATLAS_URI`
- [ ] Connection tested with `mongosh` or backup command

---

## 🆘 Troubleshooting

### Error: "Authentication failed"
**Cause:** Wrong username or password  
**Fix:** 
- Verify credentials in Atlas
- Check if password has special characters (URL-encode them)
- Make sure you're using database user, not Atlas account

### Error: "IP not whitelisted"
**Cause:** Your IP is not allowed  
**Fix:**
- Go to Network Access in Atlas
- Add 0.0.0.0/0 (allow all) or your specific IP

### Error: "getaddrinfo ENOTFOUND"
**Cause:** Network/DNS issue  
**Fix:**
- Check your internet connection
- Verify cluster URL is correct
- Try pinging the cluster URL

### Error: "MongoServerError: bad auth"
**Cause:** Wrong database user credentials  
**Fix:**
- Go to Database Access in Atlas
- Verify username and password
- Create new user if needed

---

## 📞 Quick Help

### Get Connection String:
1. Atlas Dashboard → Clusters
2. Click **"Connect"**
3. **"Connect your application"**
4. Copy the string

### Create Database User:
1. Atlas Dashboard → Database Access
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username and password
5. Set permissions to **"Atlas Admin"** or **"Read and Write"**
6. Click **"Add User"**

### Whitelist IP:
1. Atlas Dashboard → Network Access
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

---

## ✨ Next Steps

After updating `.env`:

1. **Test the connection:**
   ```bash
   npm run backup:atlas
   ```

2. **View data in Atlas:**
   - Go to Atlas Dashboard
   - Click **"Browse Collections"**
   - See your `incident-reporting` database!

3. **Set up automated backups:**
   ```bash
   npm run backup:scheduler
   ```

---

**Need help?** Copy your connection string error and we'll debug it together! 🚀
