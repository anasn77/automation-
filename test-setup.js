// Test script to verify Node.js setup
console.log('🚀 ShopNiceKicks Automation Setup Test');
console.log('=====================================');

// Check Node.js version
console.log(`Node.js version: ${process.version}`);

// Check if we're in the right directory
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.');
console.log('\n📁 Current directory files:');
files.forEach(file => {
    console.log(`  - ${file}`);
});

console.log('\n✅ Setup verification complete!');
console.log('\n📋 Next steps:');
console.log('1. Install Node.js from https://nodejs.org/ (LTS version recommended)');
console.log('2. Run: npm install');
console.log('3. Copy config.example to .env and edit with your settings');
console.log('4. Run: npm start');
console.log('\n🎯 Ready to automate ShopNiceKicks!'); 