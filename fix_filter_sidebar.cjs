const fs = require('fs');

let content = fs.readFileSync('src/components/FilterSidebar.tsx', 'utf-8');
content = content.replace(/<option value="latest">Latest Releases \(2023 \- 2026\)<\/option>/g, `<option value="all">Any Era (All Time)</option>
              <option value="latest">Latest Releases (2023 - 2026)</option>`);
fs.writeFileSync('src/components/FilterSidebar.tsx', content);
