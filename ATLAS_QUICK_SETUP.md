# ⚡ Quick Atlas Setup - 2 Minutes!

## ✅ What's Done:
- ✅ MongoDB Database Tools installed in `./mongodb-tools/`
- ✅ Backup scripts configured to use local tools
- ✅ Helper script ready to update `.env`

---

## 🎯 Next Steps (2 Minutes):

### Step 1: Get Your Atlas Connection String (1 min)

1. **Login to Atlas:**
   ```
   https://cloud.mongodb.com/
   ```

2. **Click "Connect" on your cluster**

3. **Choose "Connect your application"**

4. **Copy the connection string** - it looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Important - Replace placeholders:**
   - Change `username` to your actual username
   - Change `password` to your actual password

---

### Step 2: Update Your .env File (1 min)

**Option A: Use Helper Script (Recommended)** ⭐
```bash
npm run setup-atlas
```
Then paste your connection string when prompted!

**Option B: Manual Edit**
1. Open `.env` file
2. Find this line:
   ```
   MONGODB_ATLAS_URI=mongodb+srv://username:password@...
   ```
3. Replace with your actual connection string
4. Make sure it ends with `/incident-reporting?retryWrites=true&w=majority`

---

### Step 3: Whitelist Your IP (30 seconds)

1. In Atlas Dashboard, go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

---

## 🧪 Test It! (30 seconds)

```bash
npm run backup:atlas
```

**Success looks like:**
```
✅ Local backup completed successfully!
🌐 Uploading to MongoDB Atlas...
✅ Backup to Atlas completed successfully!
☁️  Your data is now backed up in the cloud!
```

---

## 🎉 You're Done!

### Verify Your Backup:
1. Go to https://cloud.mongodb.com/
2. Click **"Browse Collections"** on your cluster
3. You should see `incident-reporting` database with your data! 🎊

### Set Up Automated Backups:
```bash
npm run backup:scheduler
```
This backs up your database daily at 2 AM automatically!

---

## 📋 Quick Command Reference

```bash
# Setup (run once)
npm run setup-atlas              # Interactive setup helper

# Backup commands
npm run backup:atlas             # Backup to cloud
npm run backup                   # Backup locally
npm run backup:list              # List all backups

# Restore commands
npm run restore:atlas            # Restore from cloud
npm run restore                  # Restore from local

# Automation
npm run backup:scheduler         # Auto backup daily
```

---

## ⚠️ Common Issues

### "Authentication failed"
- Check username and password in connection string
- Make sure to replace `<username>` and `<password>`
- URL-encode special characters (@ → %40, # → %23, etc.)

### "IP not whitelisted"
- Go to Network Access in Atlas
- Add 0.0.0.0/0 (allow from anywhere)

### "Cannot find module 'node-cron'"
```bash
npm install
```

---

## 🆘 Need Help?

1. **Full Guide:** Read [`SETUP_ATLAS.md`](./SETUP_ATLAS.md)
2. **Commands:** See [`BACKUP_COMMANDS.md`](./BACKUP_COMMANDS.md)
3. **Testing:** Check [`TEST_BACKUP.md`](./TEST_BACKUP.md)

---

**Ready?** Run this now:
```bash
npm run setup-atlas
```
