# 🎯 MongoDB Backup - Command Cheat Sheet

## 🚀 Most Common Commands

### 1️⃣ Backup to Cloud (Recommended)
```bash
npm run backup:atlas
```
**What it does:** Backs up your entire local database to MongoDB Atlas cloud  
**When to use:** Before major updates, daily for safety  
**Result:** Your data is safe in the cloud ☁️

---

### 2️⃣ Backup Locally
```bash
npm run backup
```
**What it does:** Creates a backup file in `./backups/` folder  
**When to use:** Quick backups, testing, before experiments  
**Result:** Backup saved on your computer 💾

---

### 3️⃣ Restore from Cloud
```bash
npm run restore:atlas
```
**What it does:** Downloads database from Atlas and restores locally  
**When to use:** Disaster recovery, lost data, fresh start  
**Result:** Your local DB is restored from cloud 🔄

---

### 4️⃣ Restore from Local Backup
```bash
npm run restore
```
**What it does:** Restores the latest local backup  
**When to use:** Undo recent changes, quick rollback  
**Result:** Database restored from file 📦

---

### 5️⃣ List All Backups
```bash
npm run backup:list
```
**What it does:** Shows all available backups with dates and sizes  
**When to use:** Check what backups you have  
**Result:** See backup history 📋

---

### 6️⃣ Automated Daily Backups
```bash
npm run backup:scheduler
```
**What it does:** Runs automatic backups based on schedule (default: 2 AM daily)  
**When to use:** Set it and forget it - run 24/7  
**Result:** Automatic backups every day ⏰

---

## 📅 Typical Daily Workflow

### Morning (or anytime)
```bash
# Check your backups
npm run backup:list

# If no recent backup, create one
npm run backup:atlas
```

### Before Making Changes
```bash
# Quick safety backup
npm run backup
```

### If Something Goes Wrong
```bash
# Restore immediately
npm run restore
```

### Setup Once (Run Forever)
```bash
# Start automated backups
npm run backup:scheduler

# Or with PM2 (production):
pm2 start backup-scheduler.js --name mongo-backup
pm2 save
```

---

## 🎨 Visual Command Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKUP COMMANDS                          │
└─────────────────────────────────────────────────────────────┘

Local DB  ─────[npm run backup]────────────→  ./backups/
                                               (Files)
          
Local DB  ─────[npm run backup:atlas]──────→  MongoDB Atlas
                                               (Cloud ☁️)

┌─────────────────────────────────────────────────────────────┐
│                   RESTORE COMMANDS                          │
└─────────────────────────────────────────────────────────────┘

./backups/ ─────[npm run restore]─────────→  Local DB
(Files)                                       (Restored! ✅)

MongoDB    ─────[npm run restore:atlas]───→  Local DB
Atlas                                         (Restored! ✅)
(Cloud ☁️)

┌─────────────────────────────────────────────────────────────┐
│                 AUTOMATED BACKUPS                           │
└─────────────────────────────────────────────────────────────┘

[npm run backup:scheduler]
         ↓
    ⏰ Every day at 2 AM
         ↓
    Automatic backup to cloud & local
         ↓
    Sleep well! Your data is safe! 😴
```

---

## ⚡ Quick Copy-Paste Scripts

### Daily Backup Routine
```bash
# Run this once per day
npm run backup:atlas && npm run backup:list
```

### Full Safety Backup
```bash
# Backup to both cloud and local
npm run backup && npm run backup:atlas
```

### Emergency Restore
```bash
# Try local first, then cloud if needed
npm run restore || npm run restore:atlas
```

---

## 🔧 Setup Commands (One-Time)

### Install MongoDB Tools
```bash
# Windows (Chocolatey)
choco install mongodb-database-tools

# Or download from:
# https://www.mongodb.com/try/download/database-tools
```

### Install Dependencies
```bash
npm install
```

### Configure Atlas
```bash
# Edit .env file and add:
MONGODB_ATLAS_URI=mongodb+srv://user:pass@cluster.mongodb.net/incident-reporting
```

### Test Everything
```bash
# Create test backup
npm run backup

# List it
npm run backup:list

# Restore it
npm run restore
```

---

## 💡 Pro Tips

1. **Daily Cloud Backup**
   ```bash
   npm run backup:atlas
   ```
   Run this every day or use the scheduler!

2. **Before Big Changes**
   ```bash
   npm run backup && npm run backup:atlas
   ```
   Double safety!

3. **Production Setup**
   ```bash
   pm2 start backup-scheduler.js --name mongo-backup
   pm2 startup
   pm2 save
   ```
   Never worry about backups again!

4. **Quick Test**
   ```bash
   # Backup
   npm run backup
   
   # Check
   npm run backup:list
   
   # Restore
   npm run restore
   ```

---

## 📊 Command Comparison

| Command | Speed | Storage | Use Case |
|---------|-------|---------|----------|
| `npm run backup` | ⚡ Fast | 💾 Local | Quick backup |
| `npm run backup:atlas` | 🐌 Slower | ☁️ Cloud | Disaster recovery |
| `npm run restore` | ⚡ Fast | 💾 Local | Quick undo |
| `npm run restore:atlas` | 🐌 Slower | ☁️ Cloud | Recover from cloud |
| `npm run backup:scheduler` | ⏰ Auto | Both | Set & forget |

---

## 🎯 Decision Tree

```
Need to backup?
├─ Before making changes?
│  └─ npm run backup (quick local)
│
├─ End of day safety?
│  └─ npm run backup:atlas (cloud safety)
│
├─ Set it and forget it?
│  └─ npm run backup:scheduler (automated)
│
└─ Just checking?
   └─ npm run backup:list (see backups)

Need to restore?
├─ Recent changes went wrong?
│  └─ npm run restore (quick undo)
│
├─ Major disaster?
│  └─ npm run restore:atlas (from cloud)
│
└─ Not sure?
   └─ npm run backup:list (check available backups)
```

---

## 🆘 Emergency Commands

### Lost Everything Locally?
```bash
npm run restore:atlas
```

### Scheduler Crashed?
```bash
pm2 restart mongo-backup
# or
npm run backup:scheduler
```

### Need Specific Backup?
```bash
# First list them
npm run backup:list

# Then manually restore (advanced)
node backup.js restore /path/to/backup
```

---

## ✅ Daily Checklist

Morning:
- [ ] Check if scheduler is running: `pm2 list`
- [ ] Verify last backup: `npm run backup:list`

Before work:
- [ ] Quick backup: `npm run backup`

End of day:
- [ ] Cloud backup: `npm run backup:atlas`

Once (setup):
- [ ] Start scheduler: `pm2 start backup-scheduler.js`
- [ ] Save PM2 config: `pm2 save`

---

**Remember: The best backup is the one you actually do! 🎉**

**Start today:** `npm run backup:atlas`
