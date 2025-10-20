require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const LOCAL_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/incident-reporting';
const ATLAS_URI = process.env.MONGODB_ATLAS_URI;
const BACKUP_DIR = path.join(__dirname, 'backups');
const DATABASE_NAME = 'incident-reporting';
const TOOLS_DIR = path.join(__dirname, 'mongodb-tools');
const MONGODUMP = path.join(TOOLS_DIR, 'mongodump.exe');
const MONGORESTORE = path.join(TOOLS_DIR, 'mongorestore.exe');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('📁 Created backup directory:', BACKUP_DIR);
}

// Get timestamp for backup filename
function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
}

// Backup local MongoDB to file
function backupLocalToFile() {
    return new Promise((resolve, reject) => {
        const timestamp = getTimestamp();
        const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
        
        console.log('🔄 Starting local MongoDB backup...');
        console.log('📂 Backup location:', backupPath);
        
        const command = `"${MONGODUMP}" --uri="${LOCAL_URI}" --out="${backupPath}"`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Backup failed:', error.message);
                reject(error);
                return;
            }
            
            console.log('✅ Local backup completed successfully!');
            console.log(`📦 Backup saved to: ${backupPath}`);
            resolve(backupPath);
        });
    });
}

// Restore from backup file to local MongoDB
function restoreFileToLocal(backupPath) {
    return new Promise((resolve, reject) => {
        if (!backupPath) {
            // Find the latest backup
            const backups = fs.readdirSync(BACKUP_DIR)
                .filter(file => file.startsWith('backup-'))
                .sort()
                .reverse();
            
            if (backups.length === 0) {
                reject(new Error('No backups found'));
                return;
            }
            
            backupPath = path.join(BACKUP_DIR, backups[0], DATABASE_NAME);
            console.log('📦 Using latest backup:', backups[0]);
        }
        
        console.log('🔄 Starting restore to local MongoDB...');
        console.log('📂 Restore from:', backupPath);
        
        const command = `"${MONGORESTORE}" --uri="${LOCAL_URI}" --drop "${backupPath}"`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Restore failed:', error.message);
                reject(error);
                return;
            }
            
            console.log('✅ Restore completed successfully!');
            resolve();
        });
    });
}

// Backup local MongoDB directly to Atlas
function backupLocalToAtlas() {
    return new Promise(async (resolve, reject) => {
        if (!ATLAS_URI) {
            console.error('❌ MongoDB Atlas URI not configured!');
            console.log('💡 Please set MONGODB_ATLAS_URI in your .env file');
            reject(new Error('Atlas URI not configured'));
            return;
        }
        
        console.log('🔄 Starting backup from local to MongoDB Atlas...');
        
        // First, create a local backup
        try {
            const backupPath = await backupLocalToFile();
            const dbBackupPath = path.join(backupPath, DATABASE_NAME);
            
            // Then restore it to Atlas
            console.log('🌐 Uploading to MongoDB Atlas...');
            
            const command = `"${MONGORESTORE}" --uri="${ATLAS_URI}" --drop "${dbBackupPath}"`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('❌ Upload to Atlas failed:', error.message);
                    reject(error);
                    return;
                }
                
                console.log('✅ Backup to Atlas completed successfully!');
                console.log('☁️  Your data is now backed up in the cloud!');
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Restore from Atlas to local
function restoreAtlasToLocal() {
    return new Promise((resolve, reject) => {
        if (!ATLAS_URI) {
            console.error('❌ MongoDB Atlas URI not configured!');
            reject(new Error('Atlas URI not configured'));
            return;
        }
        
        console.log('🔄 Starting restore from MongoDB Atlas to local...');
        
        const timestamp = getTimestamp();
        const tempBackupPath = path.join(BACKUP_DIR, `atlas-backup-${timestamp}`);
        
        // First, dump from Atlas
        const dumpCommand = `"${MONGODUMP}" --uri="${ATLAS_URI}" --out="${tempBackupPath}"`;
        
        exec(dumpCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Download from Atlas failed:', error.message);
                reject(error);
                return;
            }
            
            console.log('✅ Downloaded from Atlas');
            console.log('🔄 Restoring to local MongoDB...');
            
            // Then restore to local
            const dbBackupPath = path.join(tempBackupPath, DATABASE_NAME);
            const restoreCommand = `"${MONGORESTORE}" --uri="${LOCAL_URI}" --drop "${dbBackupPath}"`;
            
            exec(restoreCommand, (restoreError, restoreStdout, restoreStderr) => {
                if (restoreError) {
                    console.error('❌ Restore to local failed:', restoreError.message);
                    reject(restoreError);
                    return;
                }
                
                console.log('✅ Restore from Atlas completed successfully!');
                resolve();
            });
        });
    });
}

// List available backups
function listBackups() {
    console.log('\n📋 Available Backups:');
    console.log('─────────────────────────────────────');
    
    if (!fs.existsSync(BACKUP_DIR)) {
        console.log('No backups found.');
        return;
    }
    
    const backups = fs.readdirSync(BACKUP_DIR)
        .filter(file => file.startsWith('backup-') || file.startsWith('atlas-backup-'))
        .sort()
        .reverse();
    
    if (backups.length === 0) {
        console.log('No backups found.');
        return;
    }
    
    backups.forEach((backup, index) => {
        const backupPath = path.join(BACKUP_DIR, backup);
        const stats = fs.statSync(backupPath);
        const size = (stats.size / 1024).toFixed(2);
        const date = stats.mtime.toLocaleString();
        
        console.log(`${index + 1}. ${backup}`);
        console.log(`   📅 Created: ${date}`);
        console.log(`   📦 Size: ${size} KB`);
        console.log('');
    });
}

// Main CLI handler
async function main() {
    const command = process.argv[2];
    
    console.log('╔═══════════════════════════════════════════════╗');
    console.log('║   MongoDB Backup & Restore Utility            ║');
    console.log('╚═══════════════════════════════════════════════╝\n');
    
    try {
        switch (command) {
            case 'backup':
                await backupLocalToFile();
                break;
                
            case 'backup-to-atlas':
            case 'upload':
                await backupLocalToAtlas();
                break;
                
            case 'restore':
                await restoreFileToLocal();
                break;
                
            case 'restore-from-atlas':
            case 'download':
                await restoreAtlasToLocal();
                break;
                
            case 'list':
                listBackups();
                break;
                
            default:
                console.log('📖 Usage:');
                console.log('  node backup.js backup              - Backup local DB to file');
                console.log('  node backup.js backup-to-atlas     - Backup local DB to Atlas cloud');
                console.log('  node backup.js restore             - Restore latest backup to local');
                console.log('  node backup.js restore-from-atlas  - Restore from Atlas to local');
                console.log('  node backup.js list                - List all backups');
                console.log('\n💡 Tips:');
                console.log('  - Set MONGODB_ATLAS_URI in .env for cloud backup');
                console.log('  - Backups are stored in ./backups/ directory');
                console.log('  - Use backup-to-atlas for cloud backup & disaster recovery');
                break;
        }
    } catch (error) {
        console.error('\n❌ Operation failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    backupLocalToFile,
    restoreFileToLocal,
    backupLocalToAtlas,
    restoreAtlasToLocal,
    listBackups
};
