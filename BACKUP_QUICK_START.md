# 🚀 Quick Start: MongoDB Backup to Atlas

## ⚡ 3-Minute Setup

### Step 1: Install MongoDB Tools (if not already installed)
**Check if installed:**
```bash
mongodump --version
```

**If not installed, download from:**
https://www.mongodb.com/try/download/database-tools

Or using Chocolatey (Windows):
```bash
choco install mongodb-database-tools
```

### Step 2: Create Free MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account (no credit card needed)
3. Create a FREE cluster (M0 - 512MB)

### Step 3: Get Your Atlas Connection String
1. In Atlas Dashboard, click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```
4. **Important**: Replace `<password>` with your actual password!

### Step 4: Configure Your .env File
Open `.env` and update this line:
```bash
MONGODB_ATLAS_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/incident-reporting?retryWrites=true&w=majority
```

### Step 5: Whitelist Your IP in Atlas
1. In Atlas, go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **Confirm**

### Step 6: Backup Your Database! 🎉
```bash
npm run backup:atlas
```

## 📋 Common Commands

```bash
# Backup local DB to Atlas cloud
npm run backup:atlas

# Backup local DB to file (./backups/)
npm run backup

# Restore from Atlas to local
npm run restore:atlas

# Restore from local backup file
npm run restore

# List all backups
npm run backup:list

# Run automated scheduler (daily backups)
npm run backup:scheduler
```

## ✅ Verify Your Backup

1. Go to your Atlas cluster
2. Click **"Browse Collections"**
3. You should see your `incident-reporting` database with data!

## 🔄 Automated Daily Backups

To backup automatically every day at 2 AM:
```bash
npm run backup:scheduler
```

Keep this running in the background! 

**Or use PM2 (recommended):**
```bash
npm install -g pm2
pm2 start backup-scheduler.js --name mongo-backup
pm2 save
pm2 startup
```

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "mongodump not found" | Install MongoDB Database Tools |
| "Authentication failed" | Check username/password in connection string |
| "IP not whitelisted" | Add 0.0.0.0/0 in Atlas Network Access |
| "No backups found" | Run `npm run backup` first |

## 📞 Need Help?

Read the full guide: [`BACKUP_GUIDE.md`](./BACKUP_GUIDE.md)

---

**That's it! Your MongoDB is now backed up to the cloud! ☁️✨**
