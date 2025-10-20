# MongoDB Backup & Restore Guide

## 🎯 Overview
This guide shows you how to backup your MongoDB database to MongoDB Atlas cloud and restore it when needed.

## 📋 Prerequisites

### 1. Install MongoDB Database Tools
You need `mongodump` and `mongorestore` utilities:

**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/database-tools
# Or install via Chocolatey:
choco install mongodb-database-tools
```

**Verify installation:**
```bash
mongodump --version
mongorestore --version
```

### 2. Set Up MongoDB Atlas (Free Cloud Database)

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Free Cluster**: Choose the free tier (M0)
3. **Create Database User**: 
   - Go to Database Access → Add New User
   - Username: `your-username`
   - Password: `your-password`
4. **Whitelist IP**: 
   - Go to Network Access → Add IP Address
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for testing
5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/incident-reporting?retryWrites=true&w=majority
   ```

### 3. Configure Environment Variables

Update your `.env` file:

```bash
# Local MongoDB (existing)
MONGODB_URI=mongodb://localhost:27017/incident-reporting

# MongoDB Atlas Cloud Backup (add this)
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/incident-reporting?retryWrites=true&w=majority

# Backup Configuration (optional)
BACKUP_SCHEDULE=0 2 * * *   # Daily at 2 AM
BACKUP_TYPE=both             # local, atlas, or both
```

**⚠️ Important**: Replace `username`, `password`, and `cluster0.xxxxx` with your actual Atlas credentials!

## 🚀 Usage

### Install Required Dependency
```bash
npm install node-cron --save
```

### 1. Backup Local Database to File
Creates a local backup in `./backups/` folder:
```bash
node backup.js backup
```

### 2. Backup Local Database to Atlas Cloud ☁️
Uploads your entire database to MongoDB Atlas:
```bash
node backup.js backup-to-atlas
```
or
```bash
node backup.js upload
```

### 3. Restore Latest Backup to Local
Restores the most recent local backup:
```bash
node backup.js restore
```

### 4. Restore from Atlas to Local
Downloads data from Atlas and restores locally:
```bash
node backup.js restore-from-atlas
```
or
```bash
node backup.js download
```

### 5. List All Backups
Shows all available backups:
```bash
node backup.js list
```

## ⏰ Automated Scheduled Backups

Run the backup scheduler in the background:

```bash
node backup-scheduler.js
```

This will automatically backup your database based on the schedule in `.env`.

### Schedule Examples:
- `0 2 * * *` - Every day at 2:00 AM
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 0` - Every Sunday at midnight
- `*/30 * * * *` - Every 30 minutes

### Run Scheduler as Background Service (Windows)

**Option 1: Using npm script**
```bash
npm run backup-scheduler
```

**Option 2: Using PM2 (recommended for production)**
```bash
npm install -g pm2
pm2 start backup-scheduler.js --name "mongo-backup"
pm2 save
pm2 startup
```

## 📖 Common Scenarios

### Scenario 1: Regular Daily Cloud Backup
**Goal**: Backup to Atlas every night
```bash
# Set in .env:
BACKUP_SCHEDULE=0 2 * * *
BACKUP_TYPE=atlas

# Run scheduler:
node backup-scheduler.js
```

### Scenario 2: Hourly Local Backup + Daily Cloud Backup
**Goal**: Frequent local backups and daily cloud backup
```bash
# For hourly local backups:
BACKUP_SCHEDULE=0 * * * *
BACKUP_TYPE=local

# For daily cloud backup (separate process):
BACKUP_SCHEDULE=0 3 * * *
BACKUP_TYPE=atlas
```

### Scenario 3: Migrate from Local to Cloud
**Goal**: Move your database to Atlas permanently
```bash
# 1. Backup to Atlas
node backup.js backup-to-atlas

# 2. Update .env to use Atlas as primary:
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/incident-reporting

# 3. Restart your server
npm start
```

### Scenario 4: Disaster Recovery
**Goal**: Lost local data, restore from cloud
```bash
# Restore from Atlas
node backup.js restore-from-atlas
```

## 🔧 NPM Scripts

Add these to `package.json` for convenience:

```json
{
  "scripts": {
    "backup": "node backup.js backup",
    "backup:atlas": "node backup.js backup-to-atlas",
    "restore": "node backup.js restore",
    "restore:atlas": "node backup.js restore-from-atlas",
    "backup:list": "node backup.js list",
    "backup:scheduler": "node backup-scheduler.js"
  }
}
```

Then use:
```bash
npm run backup
npm run backup:atlas
npm run restore
npm run backup:scheduler
```

## 📊 Backup Directory Structure

```
reporting-map/
├── backups/
│   ├── backup-2025-10-20T14-30-00/       # Local backup
│   │   └── incident-reporting/
│   │       ├── incidents.bson
│   │       └── incidents.metadata.json
│   ├── backup-2025-10-21T02-00-00/       # Another backup
│   └── atlas-backup-2025-10-21T10-15-00/ # Downloaded from Atlas
└── backup.js
```

## ⚠️ Important Notes

1. **MongoDB Tools Required**: Make sure `mongodump` and `mongorestore` are installed
2. **Atlas Free Tier**: Free tier has 512MB storage limit
3. **Network Access**: Ensure your IP is whitelisted in Atlas
4. **Connection String**: Never commit `.env` file with credentials to Git
5. **Backup Size**: Large databases may take time to upload/download
6. **Data Safety**: Always test restore process before relying on backups

## 🆘 Troubleshooting

### Error: "mongodump: command not found"
- Install MongoDB Database Tools from: https://www.mongodb.com/try/download/database-tools
- Add to system PATH

### Error: "Authentication failed"
- Check your Atlas username and password
- Ensure special characters in password are URL-encoded
- Example: `p@ssw0rd!` becomes `p%40ssw0rd%21`

### Error: "IP not whitelisted"
- Go to Atlas → Network Access
- Add your IP address or allow all (0.0.0.0/0)

### Error: "No backups found"
- Run `node backup.js backup` first to create a backup

## 📞 Support

For issues:
1. Check if MongoDB tools are installed: `mongodump --version`
2. Verify Atlas connection: Test connection in Atlas dashboard
3. Check `.env` configuration
4. Review error messages in console

## 🎉 Best Practices

1. ✅ Backup to Atlas at least daily
2. ✅ Keep local backups for quick recovery
3. ✅ Test restore process regularly
4. ✅ Monitor backup scheduler logs
5. ✅ Use environment variables for credentials
6. ✅ Set up alerts for failed backups
7. ✅ Document your backup/restore procedures

---

**Ready to backup?** Start with:
```bash
node backup.js backup-to-atlas
```
