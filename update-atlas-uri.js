const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('╔═══════════════════════════════════════════════╗');
console.log('║   MongoDB Atlas URI Configuration Helper     ║');
console.log('╚═══════════════════════════════════════════════╝\n');

console.log('📋 Instructions:');
console.log('1. Login to https://cloud.mongodb.com/');
console.log('2. Click "Connect" on your cluster');
console.log('3. Choose "Connect your application"');
console.log('4. Copy the connection string\n');

console.log('📝 Your connection string should look like:');
console.log('mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority\n');

console.log('⚠️  Important:');
console.log('- Replace <username> with your actual username');
console.log('- Replace <password> with your actual password');
console.log('- Add database name: /incident-reporting at the end\n');

rl.question('🔗 Paste your MongoDB Atlas connection string here:\n', (atlasUri) => {
    atlasUri = atlasUri.trim();

    // Validate the URI
    if (!atlasUri.startsWith('mongodb+srv://') && !atlasUri.startsWith('mongodb://')) {
        console.log('\n❌ Invalid connection string! It should start with mongodb+srv:// or mongodb://');
        rl.close();
        return;
    }

    // Check if it contains placeholder values
    if (atlasUri.includes('<username>') || atlasUri.includes('<password>')) {
        console.log('\n❌ Please replace <username> and <password> with your actual credentials!');
        rl.close();
        return;
    }

    // Check if database name is included
    if (!atlasUri.includes('/incident-reporting')) {
        console.log('\n💡 Adding database name to connection string...');
        
        // Find the position to insert database name
        const questionMarkIndex = atlasUri.indexOf('?');
        if (questionMarkIndex > 0) {
            // Insert before the query parameters
            const beforeQuery = atlasUri.substring(0, questionMarkIndex);
            const queryParams = atlasUri.substring(questionMarkIndex);
            
            if (!beforeQuery.endsWith('/incident-reporting')) {
                if (beforeQuery.endsWith('/')) {
                    atlasUri = beforeQuery + 'incident-reporting' + queryParams;
                } else {
                    atlasUri = beforeQuery + '/incident-reporting' + queryParams;
                }
            }
        } else {
            // No query parameters, just add at the end
            if (!atlasUri.endsWith('/')) {
                atlasUri += '/';
            }
            atlasUri += 'incident-reporting?retryWrites=true&w=majority';
        }
    }

    console.log('\n✅ Connection string validated!\n');
    console.log('📝 Your connection string:');
    console.log(atlasUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@') + '\n'); // Hide password in display

    rl.question('💾 Update .env file with this URI? (yes/no): ', (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
            updateEnvFile(atlasUri);
        } else {
            console.log('\n❌ Update cancelled.');
            console.log('💡 To update manually, edit the .env file and update this line:');
            console.log(`MONGODB_ATLAS_URI=${atlasUri}`);
        }
        rl.close();
    });
});

function updateEnvFile(atlasUri) {
    const envPath = path.join(__dirname, '.env');
    
    try {
        // Read current .env file
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Update MONGODB_ATLAS_URI
        const atlasUriRegex = /MONGODB_ATLAS_URI=.*/;
        if (envContent.match(atlasUriRegex)) {
            envContent = envContent.replace(atlasUriRegex, `MONGODB_ATLAS_URI=${atlasUri}`);
        } else {
            // If not found, add it after MONGODB_URI
            const localUriRegex = /(MONGODB_URI=.*)/;
            envContent = envContent.replace(localUriRegex, `$1\n\n# MongoDB Atlas Cloud Backup\nMONGODB_ATLAS_URI=${atlasUri}`);
        }
        
        // Write back to .env
        fs.writeFileSync(envPath, envContent);
        
        console.log('\n✅ .env file updated successfully!\n');
        console.log('📋 Configuration Summary:');
        console.log('─────────────────────────────────────');
        
        // Show current configuration
        const envLines = envContent.split('\n');
        envLines.forEach(line => {
            if (line.startsWith('MONGODB_URI=')) {
                const uri = line.split('=')[1];
                console.log(`Local DB:  ${uri}`);
            }
            if (line.startsWith('MONGODB_ATLAS_URI=')) {
                const uri = line.split('=')[1];
                console.log(`Atlas URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
            }
        });
        
        console.log('\n🧪 Test Your Configuration:');
        console.log('─────────────────────────────────────');
        console.log('1. Test backup to Atlas:');
        console.log('   npm run backup:atlas\n');
        console.log('2. View your data in Atlas:');
        console.log('   https://cloud.mongodb.com/ → Browse Collections\n');
        console.log('3. Start automated backups:');
        console.log('   npm run backup:scheduler\n');
        
        console.log('🎉 You\'re all set! Your MongoDB backup system is ready!\n');
        
    } catch (error) {
        console.error('\n❌ Error updating .env file:', error.message);
        console.log('\n💡 Please update manually:');
        console.log(`MONGODB_ATLAS_URI=${atlasUri}`);
    }
}
