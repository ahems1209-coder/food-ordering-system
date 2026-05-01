import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../frontend/src');

const filesToProcess = [
  'pages/Welcome.jsx',
  'pages/Register.jsx',
  'pages/Orders.jsx',
  'pages/Login.jsx',
  'pages/Kitchen.jsx',
  'pages/Dashboard.jsx',
  'pages/Home.jsx',
  'pages/Admin.jsx',
  'pages/Cart.jsx',
  'components/OrderTracker.jsx'
];

filesToProcess.forEach(file => {
  const filePath = path.join(srcDir, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace URLs
  content = content.replace(/\"http:\/\/localhost:5000/g, '`${API_URL}');
  
  // Add import if needed
  if (content.includes('API_URL') && !content.includes('import API_URL')) {
    const importPath = file.includes('components/') ? '../api' : '../api';
    // Better logic for import path
    const depth = file.split('/').length - 1;
    const prefix = '../'.repeat(depth);
    content = `import API_URL from "${prefix}api";\n` + content;
  }
  
  // Fix Admin.jsx missing imports if I broke them
  if (file === 'pages/Admin.jsx' && !content.includes('useState')) {
    content = `import { useState, useEffect } from "react";\n` + content;
  }

  fs.writeFileSync(filePath, content);
});

console.log('All files processed successfully.');
