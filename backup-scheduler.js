require('dotenv').config();
const cron = require('node-cron');
const { backupLocalToAtlas, backupLocalToFile } = require('./backup');

console.log('╔═══════════════════════════════════════════════╗');
console.log('║   Automated MongoDB Backup Scheduler          ║');
console.log('╚═══════════════════════════════════════════════╝\n');

// Configuration
const BACKUP_SCHEDULE = process.env.BACKUP_SCHEDULE || '0 2 * * *'; // Default: 2 AM daily
const BACKUP_TYPE = process.env.BACKUP_TYPE || 'both'; // 'local', 'atlas', or 'both'

console.log('📅 Backup Schedule:', BACKUP_SCHEDULE);
console.log('💾 Backup Type:', BACKUP_TYPE);
console.log('🕐 Scheduler started!\n');

// Schedule backup task
cron.schedule(BACKUP_SCHEDULE, async () => {
    const timestamp = new Date().toLocaleString();
    console.log(`\n⏰ [${timestamp}] Running scheduled backup...`);
    
    try {
        if (BACKUP_TYPE === 'local' || BACKUP_TYPE === 'both') {
            console.log('📦 Creating local backup...');
            await backupLocalToFile();
        }
        
        if (BACKUP_TYPE === 'atlas' || BACKUP_TYPE === 'both') {
            console.log('☁️  Creating cloud backup...');
            await backupLocalToAtlas();
        }
        
        console.log(`✅ [${new Date().toLocaleString()}] Scheduled backup completed!\n`);
    } catch (error) {
        console.error(`❌ [${new Date().toLocaleString()}] Backup failed:`, error.message);
    }
});

console.log('📖 Schedule format (Cron):');
console.log('   ┌───── minute (0-59)');
console.log('   │ ┌───── hour (0-23)');
console.log('   │ │ ┌───── day of month (1-31)');
console.log('   │ │ │ ┌───── month (1-12)');
console.log('   │ │ │ │ ┌───── day of week (0-7)');
console.log('   │ │ │ │ │');
console.log('   * * * * *\n');

console.log('📋 Examples:');
console.log('   0 2 * * *     - Every day at 2:00 AM');
console.log('   0 */6 * * *   - Every 6 hours');
console.log('   0 0 * * 0     - Every Sunday at midnight');
console.log('   */30 * * * *  - Every 30 minutes\n');

console.log('✅ Scheduler is running. Press Ctrl+C to stop.\n');

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Scheduler stopped gracefully.');
    process.exit(0);
});
