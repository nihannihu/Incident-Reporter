# 🧪 Testing Your Backup System

## Before You Start

Make sure you have:
1. ✅ MongoDB Database Tools installed (`mongodump` and `mongorestore`)
2. ✅ Some data in your local database (create a few incidents first)
3. ✅ MongoDB Atlas account set up (optional for cloud backup)

## Test 1: Local Backup ✅

### Create a local backup:
```bash
npm run backup
```

**Expected Output:**
```
╔═══════════════════════════════════════════════╗
║   MongoDB Backup & Restore Utility            ║
╚═══════════════════════════════════════════════╝

🔄 Starting local MongoDB backup...
📂 Backup location: C:\...\backups\backup-2025-10-20T14-30-00
✅ Local backup completed successfully!
📦 Backup saved to: C:\...\backups\backup-2025-10-20T14-30-00
```

### Verify the backup:
```bash
npm run backup:list
```

**Expected Output:**
```
📋 Available Backups:
─────────────────────────────────────
1. backup-2025-10-20T14-30-00
   📅 Created: 10/20/2025, 2:30:00 PM
   📦 Size: 125.50 KB
```

✅ **Test Passed** if you see your backup listed!

---

## Test 2: Restore from Local Backup ✅

### Delete some data (to test restore):
1. Go to http://localhost:3001
2. Note the number of incidents
3. Delete one or two incidents

### Restore the backup:
```bash
npm run restore
```

**Expected Output:**
```
🔄 Starting restore to local MongoDB...
📂 Restore from: C:\...\backups\backup-2025-10-20T14-30-00
✅ Restore completed successfully!
```

### Verify:
1. Refresh your browser (http://localhost:3001)
2. Check if deleted incidents are back!

✅ **Test Passed** if your data is restored!

---

## Test 3: Cloud Backup to Atlas ☁️

**⚠️ Important**: You MUST set up `MONGODB_ATLAS_URI` in `.env` first!

### Configure Atlas:
```bash
# Open .env and update this line:
MONGODB_ATLAS_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/incident-reporting?retryWrites=true&w=majority
```

### Backup to cloud:
```bash
npm run backup:atlas
```

**Expected Output:**
```
🔄 Starting backup from local to MongoDB Atlas...
🔄 Starting local MongoDB backup...
✅ Local backup completed successfully!
🌐 Uploading to MongoDB Atlas...
✅ Backup to Atlas completed successfully!
☁️  Your data is now backed up in the cloud!
```

### Verify in Atlas:
1. Login to https://cloud.mongodb.com/
2. Click "Browse Collections" on your cluster
3. You should see `incident-reporting` database with your data!

✅ **Test Passed** if you see your data in Atlas!

---

## Test 4: Restore from Atlas ☁️

### Delete ALL local data (brave test!):
```bash
# Connect to local MongoDB
mongosh mongodb://localhost:27017/incident-reporting

# In MongoDB shell:
db.incidents.deleteMany({})
exit
```

### Restore from cloud:
```bash
npm run restore:atlas
```

**Expected Output:**
```
🔄 Starting restore from MongoDB Atlas to local...
✅ Downloaded from Atlas
🔄 Restoring to local MongoDB...
✅ Restore from Atlas completed successfully!
```

### Verify:
1. Refresh browser
2. All your incidents should be back!

✅ **Test Passed** if all data is restored from cloud!

---

## Test 5: Automated Scheduler ⏰

### Start the scheduler:
```bash
npm run backup:scheduler
```

**Expected Output:**
```
╔═══════════════════════════════════════════════╗
║   Automated MongoDB Backup Scheduler          ║
╚═══════════════════════════════════════════════╝

📅 Backup Schedule: 0 2 * * *
💾 Backup Type: both
🕐 Scheduler started!

✅ Scheduler is running. Press Ctrl+C to stop.
```

### Test immediate backup:
Change the schedule in `.env` to run every minute:
```bash
BACKUP_SCHEDULE=* * * * *
```

Restart scheduler and wait 1 minute - you should see:
```
⏰ [10/20/2025, 2:45:00 PM] Running scheduled backup...
📦 Creating local backup...
✅ Local backup completed successfully!
☁️  Creating cloud backup...
✅ Backup to Atlas completed successfully!
✅ [10/20/2025, 2:45:15 PM] Scheduled backup completed!
```

✅ **Test Passed** if backup runs automatically!

---

## 🎯 Quick Command Reference

| Command | What it does |
|---------|-------------|
| `npm run backup` | Backup local DB to file |
| `npm run backup:atlas` | Backup local DB to Atlas cloud |
| `npm run restore` | Restore from latest local backup |
| `npm run restore:atlas` | Restore from Atlas cloud |
| `npm run backup:list` | Show all backups |
| `npm run backup:scheduler` | Run automated scheduler |

---

## 🐛 Common Issues

### "mongodump: command not found"
**Fix:** Install MongoDB Database Tools
- Download: https://www.mongodb.com/try/download/database-tools
- Or: `choco install mongodb-database-tools`

### "Authentication failed" (Atlas)
**Fix:** Check your connection string in `.env`
- Verify username and password are correct
- URL-encode special characters in password
- Example: `p@ss` → `p%40ss`

### "IP not whitelisted" (Atlas)
**Fix:** Add your IP in Atlas
1. Go to Network Access
2. Add IP Address
3. Choose "0.0.0.0/0" (allow all)

### "No backups found"
**Fix:** Create a backup first!
```bash
npm run backup
```

---

## ✅ All Tests Passed?

Congratulations! Your backup system is working perfectly! 🎉

Now you can:
- ✅ Backup locally whenever needed
- ✅ Backup to cloud for disaster recovery
- ✅ Restore from any backup point
- ✅ Schedule automatic backups

**Best Practice:** Run cloud backup daily:
```bash
# Set in .env:
BACKUP_SCHEDULE=0 2 * * *  # 2 AM daily
BACKUP_TYPE=atlas

# Start scheduler:
npm run backup:scheduler
```

Keep this running in background with PM2 for production! 🚀
