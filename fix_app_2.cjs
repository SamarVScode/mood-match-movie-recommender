const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(/const \[isMockMode, setIsMockMode\] = useState\(true\);/g, 'const [isMockMode, setIsMockMode] = useState(false);');
fs.writeFileSync('src/App.tsx', content);
