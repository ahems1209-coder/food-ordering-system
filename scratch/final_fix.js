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

  // 1. Remove ANY and ALL imports from 'react' to start fresh
  content = content.replace(/^import.*from\s+['"]react['"];?\n?/gm, '');

  // 2. Add clean React import at the top
  content = `import { useState, useEffect } from "react";\n` + content;

  // 3. Fix API_URL imports - remove existing ones first
  content = content.replace(/^import\s+API_URL.*api['"];?\n?/gm, '');
  
  const depth = file.split('/').length - 1;
  const prefix = '../'.repeat(depth);
  content = `import API_URL from "${prefix}api";\n` + content;

  // 4. Fix ALL localhost:5000 occurrences
  content = content.replace(/['"]http:\/\/localhost:5000([^'"]*)['"]/g, '`${API_URL}$1`');
  content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${API_URL}$1`');

  // 5. Clean up duplicate lines and fix console logs
  content = content.replace(/console\.(error|log)\(`([^"`]*)",/g, 'console.$1("$2",');
  content = content.replace(/console\.(error|log)\("([^"`]*)`,/g, 'console.$1("$2",');

  fs.writeFileSync(filePath, content);
});

console.log('Final complete normalization complete.');
