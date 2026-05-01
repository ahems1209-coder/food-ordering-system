import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../frontend/src');

// Fix Admin.jsx QR Code
const adminPath = path.join(srcDir, 'pages/Admin.jsx');
if (fs.existsSync(adminPath)) {
  let content = fs.readFileSync(adminPath, 'utf8');
  content = content.replace(/value={`\${baseUrl}\/\?table=\${num}`}/g, 'value={`${baseUrl}/?table=${num}&restaurant=${JSON.parse(localStorage.getItem("user"))._id}`}');
  fs.writeFileSync(adminPath, content);
}

// Fix Home.jsx food fetching
const homePath = path.join(srcDir, 'pages/Home.jsx');
if (fs.existsSync(homePath)) {
  let content = fs.readFileSync(homePath, 'utf8');
  content = content.replace(/axios\.get\(`\${API_URL}\/api\/foods`\)/g, 'axios.get(`${API_URL}/api/foods?restaurantId=${localStorage.getItem("restaurantId")}`)');
  fs.writeFileSync(homePath, content);
}

// Fix Cart.jsx order placement
const cartPath = path.join(srcDir, 'pages/Cart.jsx');
if (fs.existsSync(cartPath)) {
  let content = fs.readFileSync(cartPath, 'utf8');
  content = content.replace(/const orderData = \{([^}]*)\};/s, 'const orderData = {$1, restaurantId: localStorage.getItem("restaurantId") };');
  fs.writeFileSync(cartPath, content);
}

console.log('Multi-tenancy frontend fix complete.');
