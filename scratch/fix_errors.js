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
  
  // Fix the quote mismatch: `${API_URL}/api/foods" -> `${API_URL}/api/foods`
  content = content.replace(/\$\{API_URL\}([^"']*)\"/g, '${API_URL}$1`');
  content = content.replace(/\$\{API_URL\}([^"']*)\'/g, '${API_URL}$1`');

  // Ensure React imports are correct
  if (content.includes('useState') || content.includes('useEffect')) {
    if (!content.includes('import { useState, useEffect } from "react"')) {
       // Remove any partial or incorrect react imports
       content = content.replace(/import\s*{\s*useState\s*,\s*useEffect\s*}\s*from\s*['"]react['"];?/g, '');
       content = `import { useState, useEffect } from "react";\n` + content;
    }
  }

  fs.writeFileSync(filePath, content);
});

console.log('Errors fixed successfully.');
