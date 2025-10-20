require('dotenv').config();

console.log('╔═══════════════════════════════════════════════╗');
console.log('║   MongoDB Atlas Connection String Guide      ║');
console.log('╚═══════════════════════════════════════════════╝\n');

console.log('📋 How to Get Your Atlas Connection String:\n');

console.log('1️⃣  Login to MongoDB Atlas:');
console.log('   👉 https://cloud.mongodb.com/\n');

console.log('2️⃣  Navigate to your cluster:');
console.log('   - Click on "Database" in left sidebar');
console.log('   - You should see your cluster listed\n');

console.log('3️⃣  Click "Connect" button on your cluster\n');

console.log('4️⃣  Choose "Connect your application"\n');

console.log('5️⃣  Select Driver and Version:');
console.log('   - Driver: Node.js');
console.log('   - Version: 5.5 or later\n');

console.log('6️⃣  Copy the connection string\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📝 Your connection string will look like this:\n');
console.log('mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority\n');

console.log('⚠️  IMPORTANT - You must replace:\n');
console.log('   ❌ <username>  →  ✅ your-actual-username');
console.log('   ❌ <password>  →  ✅ your-actual-password\n');

console.log('💡 EXAMPLE (before replacement):\n');
console.log('mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority\n');

console.log('💡 EXAMPLE (after replacement):\n');
console.log('mongodb+srv://myuser:MyPass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📝 NEXT STEP - Update Your .env File:\n');

console.log('1. Open the .env file in this project');
console.log('2. Find this line:');
console.log('   MONGODB_ATLAS_URI=mongodb+srv://username:password@...\n');
console.log('3. Replace with YOUR connection string');
console.log('4. Make sure it ends with: /incident-reporting?retryWrites=true&w=majority\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('⚠️  Special Characters in Password?\n');
console.log('If your password contains these characters, you MUST URL-encode them:\n');
console.log('   @ → %40');
console.log('   : → %3A');
console.log('   / → %2F');
console.log('   # → %23');
console.log('   ? → %3F');
console.log('   & → %26\n');

console.log('Example: Password "My@Pass#123" becomes "My%40Pass%23123"\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🔒 Whitelist Your IP Address:\n');
console.log('1. In Atlas, go to "Network Access" (left sidebar)');
console.log('2. Click "Add IP Address"');
console.log('3. Choose "Allow Access from Anywhere" (0.0.0.0/0)');
console.log('4. Click "Confirm"\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🧪 After Updating .env, Test Your Connection:\n');
console.log('   npm run backup:atlas\n');

console.log('✅ Success looks like:\n');
console.log('   🔄 Starting backup from local to MongoDB Atlas...');
console.log('   ✅ Local backup completed successfully!');
console.log('   🌐 Uploading to MongoDB Atlas...');
console.log('   ✅ Backup to Atlas completed successfully!');
console.log('   ☁️  Your data is now backed up in the cloud!\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📋 Current .env Configuration:\n');

if (process.env.MONGODB_ATLAS_URI) {
    const uri = process.env.MONGODB_ATLAS_URI;
    
    // Check if it's still the default/placeholder
    if (uri.includes('username:password') || uri.includes('<username>') || uri.includes('<password>')) {
        console.log('   ⚠️  Status: NEEDS UPDATE');
        console.log('   Current: ' + uri);
        console.log('\n   👉 You need to replace this with your actual Atlas connection string!\n');
    } else {
        // Mask the password for security
        const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
        console.log('   ✅ Status: Configured');
        console.log('   URI: ' + maskedUri + '\n');
        console.log('   👉 Ready to test! Run: npm run backup:atlas\n');
    }
} else {
    console.log('   ⚠️  MONGODB_ATLAS_URI not found in .env\n');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🆘 Need Help?\n');
console.log('   - Full guide: SETUP_ATLAS.md');
console.log('   - Quick start: ATLAS_QUICK_SETUP.md');
console.log('   - Command reference: BACKUP_COMMANDS.md\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
