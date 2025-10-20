# 📦 MongoDB Backup System - Complete Summary

## 🎯 What You Got

A complete MongoDB backup and restore solution with:
- ✅ **Local file backups** (using `mongodump`)
- ✅ **Cloud backups to MongoDB Atlas** (disaster recovery)
- ✅ **Automated scheduling** (daily/hourly backups)
- ✅ **Easy restore** (one command restore)
- ✅ **Backup management** (list all backups)

---

## 📁 New Files Added

```
reporting-map/
├── backup.js                    # Main backup/restore utility
├── backup-scheduler.js          # Automated backup scheduler
├── BACKUP_GUIDE.md             # Complete documentation
├── BACKUP_QUICK_START.md       # 3-minute setup guide
├── TEST_BACKUP.md              # Testing instructions
├── BACKUP_SUMMARY.md           # This file
├── .env                        # Updated with Atlas URI
├── package.json                # Updated with backup scripts
└── backups/                    # Backup storage folder (auto-created)
    ├── backup-YYYY-MM-DD/
    └── atlas-backup-YYYY-MM-DD/
```

---

## 🚀 Quick Commands

### Backup Commands
```bash
# Create local backup
npm run backup

# Backup to Atlas cloud
npm run backup:atlas

# Alternative command
npm run backup:upload
```

### Restore Commands
```bash
# Restore latest local backup
npm run restore

# Restore from Atlas cloud
npm run restore:atlas

# Alternative command
npm run restore:download
```

### Management Commands
```bash
# List all backups
npm run backup:list

# Run automated scheduler
npm run backup:scheduler
```

### Direct Commands (alternative)
```bash
node backup.js backup
node backup.js backup-to-atlas
node backup.js restore
node backup.js restore-from-atlas
node backup.js list
```

---

## 🔧 Configuration (.env)

```bash
# Local MongoDB (your current database)
MONGODB_URI=mongodb://localhost:27017/incident-reporting

# MongoDB Atlas Cloud Backup (add your Atlas connection)
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/incident-reporting?retryWrites=true&w=majority

# Backup Scheduler Settings
BACKUP_SCHEDULE=0 2 * * *   # Daily at 2 AM (cron format)
BACKUP_TYPE=both             # Options: local, atlas, or both
```

---

## 📊 Backup Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR LOCAL DATABASE                       │
│              mongodb://localhost:27017                       │
│                  (incident-reporting)                        │
└──────────────┬─────────────────────────────────┬────────────┘
               │                                 │
               │ npm run backup                  │ npm run backup:atlas
               ▼                                 ▼
    ┌──────────────────────┐          ┌─────────────────────────┐
    │  LOCAL FILE BACKUP   │          │   MONGODB ATLAS CLOUD   │
    │   ./backups/         │          │  (Cloud Backup)         │
    │  backup-2025-XX-XX/  │          │  ☁️ Disaster Recovery    │
    └──────────┬───────────┘          └──────────┬──────────────┘
               │                                 │
               │ npm run restore                 │ npm run restore:atlas
               ▼                                 ▼
    ┌──────────────────────────────────────────────────────────┐
    │              RESTORE TO LOCAL DATABASE                    │
    │         mongodb://localhost:27017                         │
    └──────────────────────────────────────────────────────────┘
```

---

## ⏰ Automated Backup Schedule Examples

### Daily at 2 AM (Recommended)
```bash
BACKUP_SCHEDULE=0 2 * * *
BACKUP_TYPE=atlas
```

### Every 6 Hours
```bash
BACKUP_SCHEDULE=0 */6 * * *
BACKUP_TYPE=both
```

### Every Sunday at Midnight
```bash
BACKUP_SCHEDULE=0 0 * * 0
BACKUP_TYPE=atlas
```

### Every 30 Minutes (Testing)
```bash
BACKUP_SCHEDULE=*/30 * * * *
BACKUP_TYPE=local
```

### Cron Format Reference
```
 ┌───── minute (0-59)
 │ ┌───── hour (0-23)
 │ │ ┌───── day of month (1-31)
 │ │ │ ┌───── month (1-12)
 │ │ │ │ ┌───── day of week (0-7, Sunday=0 or 7)
 │ │ │ │ │
 * * * * *
```

---

## 🎬 Usage Scenarios

### Scenario 1: Daily Cloud Backup
**Use Case:** Keep daily backups in the cloud for disaster recovery

```bash
# Step 1: Configure .env
BACKUP_SCHEDULE=0 2 * * *
BACKUP_TYPE=atlas

# Step 2: Start scheduler
npm run backup:scheduler

# Or use PM2 for production:
pm2 start backup-scheduler.js --name mongo-backup
pm2 save
```

### Scenario 2: Quick Manual Backup Before Update
**Use Case:** Backup before making risky changes

```bash
# Quick backup to both local and cloud
npm run backup
npm run backup:atlas

# Make your changes...

# If something goes wrong, restore:
npm run restore
```

### Scenario 3: Migrate to Cloud Database
**Use Case:** Move from local MongoDB to Atlas permanently

```bash
# Step 1: Backup local to Atlas
npm run backup:atlas

# Step 2: Update .env to use Atlas as primary
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/incident-reporting

# Step 3: Restart server
npm start

# Your app now uses Atlas instead of local MongoDB!
```

### Scenario 4: Disaster Recovery
**Use Case:** Lost all local data, need to recover

```bash
# Restore from cloud backup
npm run restore:atlas

# Or restore from specific local backup
node backup.js restore
```

---

## 📋 Prerequisites Checklist

- [ ] MongoDB Database Tools installed (`mongodump` & `mongorestore`)
- [ ] MongoDB Atlas account created (free tier)
- [ ] Atlas cluster created (M0 free tier)
- [ ] Database user created in Atlas
- [ ] IP whitelisted in Atlas (0.0.0.0/0 for testing)
- [ ] Connection string added to `.env`
- [ ] `node-cron` package installed (`npm install`)

---

## 🔍 How to Get MongoDB Atlas Connection String

1. **Login** to https://cloud.mongodb.com/
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** driver
5. Copy the connection string
6. Replace `<password>` with your actual password
7. Add database name: `/incident-reporting`

**Example:**
```
mongodb+srv://myuser:MyPassword123@cluster0.abc123.mongodb.net/incident-reporting?retryWrites=true&w=majority
```

**⚠️ Important:** 
- Replace `<password>` with actual password
- URL-encode special characters (e.g., `@` → `%40`, `!` → `%21`)
- Add database name at the end

---

## 🛠️ Troubleshooting Guide

| Problem | Solution |
|---------|----------|
| `mongodump: command not found` | Install MongoDB Database Tools from mongodb.com |
| `Authentication failed` | Check username/password in Atlas URI |
| `IP not whitelisted` | Add 0.0.0.0/0 in Atlas Network Access |
| `No backups found` | Run `npm run backup` to create first backup |
| `Connection timeout` | Check Atlas network access and firewall |
| `Scheduler not running` | Ensure `node-cron` is installed |

---

## 📊 Backup Storage Info

### Local Backups
- **Location:** `./backups/`
- **Format:** BSON files + metadata
- **Size:** Varies based on data (typically KB to MB)
- **Retention:** Manual (delete old backups as needed)

### Atlas Backups
- **Location:** MongoDB Atlas Cloud
- **Free Tier:** 512 MB storage
- **Format:** Full database dump
- **Automatic Cleanup:** Overwrites on each upload

---

## 💡 Best Practices

1. ✅ **Backup Daily to Atlas** - Set scheduler for 2 AM daily
2. ✅ **Test Restore Process** - Practice restoring monthly
3. ✅ **Keep Multiple Local Backups** - Don't delete old backups immediately
4. ✅ **Monitor Scheduler** - Check logs regularly
5. ✅ **Secure Credentials** - Never commit `.env` to Git
6. ✅ **Document Procedures** - Train team on backup/restore
7. ✅ **Use PM2 for Scheduler** - Run scheduler as background service

---

## 🎓 Next Steps

1. **Setup Atlas** (5 min)
   - Create account at https://cloud.mongodb.com/
   - Create free cluster
   - Get connection string
   - Update `.env`

2. **Test Backup** (2 min)
   ```bash
   npm run backup:atlas
   ```

3. **Start Scheduler** (1 min)
   ```bash
   npm run backup:scheduler
   ```

4. **Verify in Atlas** (2 min)
   - Login to Atlas
   - Browse Collections
   - See your data! ✨

---

## 📚 Documentation Files

- **BACKUP_QUICK_START.md** - 3-minute setup guide
- **BACKUP_GUIDE.md** - Complete documentation
- **TEST_BACKUP.md** - Testing procedures
- **BACKUP_SUMMARY.md** - This overview

---

## 🎉 Success Criteria

You'll know everything is working when:
- ✅ `npm run backup` creates local backups
- ✅ `npm run backup:atlas` uploads to cloud
- ✅ `npm run restore` recovers local data
- ✅ `npm run restore:atlas` downloads from cloud
- ✅ Scheduler runs automatically
- ✅ Data visible in Atlas dashboard

---

## 🆘 Support

1. Check documentation in `/BACKUP_GUIDE.md`
2. Review troubleshooting in this file
3. Test using `/TEST_BACKUP.md` procedures
4. Verify MongoDB tools: `mongodump --version`

---

**Your MongoDB database is now fully backed up and protected! 🎉**

Start with: `npm run backup:atlas`
