const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const ncp = promisify(require('ncp').ncp);

async function copyStaticFiles() {
  const sourceDir = path.join(__dirname, '../server/static');
  const destDir = path.join(__dirname, '../dist/static');
  
  try {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy files
    await ncp(sourceDir, destDir, {
      clobber: true,
      stopOnErr: true
    });
    
    console.log('Static files copied successfully!');
  } catch (error) {
    console.error('Error copying static files:', error);
    process.exit(1);
  }
}

copyStaticFiles();
