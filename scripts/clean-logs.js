#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to remove or comment console.log statements
function cleanLogs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Pattern to match console.log statements (handles multi-line)
  const consoleLogPattern = /console\.(log|error|warn|info|debug)\([^)]*\);?/g;
  
  // Comment out console statements in production code
  const newContent = content.replace(consoleLogPattern, (match) => {
    // Keep console.error for error handling
    if (match.includes('console.error')) {
      return match;
    }
    modified = true;
    return `// ${match} // Removed for production`;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Cleaned: ${filePath}`);
    return 1;
  }
  return 0;
}

// Main execution
const srcPath = path.join(__dirname, '..', 'src');
const files = glob.sync('**/*.{ts,tsx,js,jsx}', { 
  cwd: srcPath,
  absolute: true 
});

let totalCleaned = 0;
files.forEach(file => {
  totalCleaned += cleanLogs(file);
});

console.log(`\nTotal files cleaned: ${totalCleaned}`);
console.log('Console statements have been commented out for production.');