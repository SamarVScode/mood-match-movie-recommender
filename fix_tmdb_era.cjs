const fs = require('fs');

let content = fs.readFileSync('src/tmdb.ts', 'utf-8');
content = content.replace(/if \(config\.era === "latest"\) \{/g, `if (config.era === "all") {
        // no date constraints
      } else if (config.era === "latest") {`);
fs.writeFileSync('src/tmdb.ts', content);
