const fs = require('fs');

let content = fs.readFileSync('src/types.ts', 'utf-8');
content = content.replace(/\} else if \(config\.era && config\.era !== "latest"\) \{/g, `} else if (config.era && config.era !== "all") {`);
fs.writeFileSync('src/types.ts', content);
