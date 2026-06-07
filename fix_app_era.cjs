const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(/era: "latest"/g, 'era: "all"');
fs.writeFileSync('src/App.tsx', content);
