#!/usr/bin/env node

/*
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  🚀 QUICK START - Incident Reporting Map                 ║
 * ╚═══════════════════════════════════════════════════════════╝
 */

console.clear();

const chalk = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

console.log('\n');
console.log(chalk.bold(chalk.cyan('═'.repeat(60))));
console.log(chalk.bold(chalk.blue('  🚨 HYPERLOCAL INCIDENT REPORTING MAP')));
console.log(chalk.bold(chalk.cyan('═'.repeat(60))));
console.log('\n');

// Check if server is running
const http = require('http');
const options = {
  host: 'localhost',
  port: 3001,
  timeout: 2000,
  path: '/'
};

const req = http.request(options, (res) => {
  console.log(chalk.green('✓ Server is RUNNING at http://localhost:3001\n'));
  
  console.log(chalk.bold('📱 NEXT STEPS:\n'));
  console.log('  1. Click the ' + chalk.bold(chalk.blue('PREVIEW BUTTON')) + ' in Qoder IDE');
  console.log('  2. Or open: ' + chalk.cyan('http://localhost:3001') + ' in your browser');
  console.log('  3. Allow location permissions when prompted');
  console.log('  4. Start reporting incidents!\n');
  
  console.log(chalk.bold('🎬 DEMO INSTRUCTIONS:\n'));
  console.log('  • Open the app in ' + chalk.yellow('TWO browsers/devices'));
  console.log('  • Report an incident in one browser');
  console.log('  • Watch it appear ' + chalk.bold('INSTANTLY') + ' in the other! ✨\n');
  
  console.log(chalk.bold('📚 DOCUMENTATION:\n'));
  console.log('  • README.md - Full project documentation');
  console.log('  • HACKATHON_PITCH.md - Presentation guide');
  console.log('  • TESTING_GUIDE.md - Testing instructions');
  console.log('  • TROUBLESHOOTING.md - Common issues\n');
  
  console.log(chalk.cyan('═'.repeat(60)));
  console.log(chalk.green('\n✨ Everything is ready! Good luck with your hackathon! 🏆\n'));
});

req.on('error', (err) => {
  console.log(chalk.red('✗ Server is NOT running\n'));
  
  console.log(chalk.bold('🚀 TO START THE SERVER:\n'));
  console.log('  Run: ' + chalk.cyan('npm start') + '\n');
  
  console.log(chalk.bold('📍 FIRST TIME SETUP:\n'));
  console.log('  1. Make sure MongoDB is running (local or Atlas)');
  console.log('  2. Check .env file configuration');
  console.log('  3. Run: ' + chalk.cyan('npm install'));
  console.log('  4. Run: ' + chalk.cyan('npm start') + '\n');
  
  console.log(chalk.bold('📚 NEED HELP?\n'));
  console.log('  • See README.md for setup instructions');
  console.log('  • See MONGODB_SETUP.md for database setup');
  console.log('  • See TROUBLESHOOTING.md for common issues\n');
  
  console.log(chalk.cyan('═'.repeat(60)));
  console.log('\n');
});

req.end();
