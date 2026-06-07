const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(/setIsMockMode\(result\.isMock\);/g, 'setIsMockMode(false);');
content = content.replace(/setIsMockMode\(feeds\.isMock\);/g, 'setIsMockMode(false);');
fs.writeFileSync('src/App.tsx', content);

// check if there are any other places with isMock
let tmdbContent = fs.readFileSync('src/tmdb.ts', 'utf-8');
tmdbContent = tmdbContent.replace(/export interface LandingFeeds \{\n  featured: Movie\[\];\n  bollywood: Movie\[\];\n  hollywood: Movie\[\];\n  adult18: Movie\[\];\n  highestRatedAction: Movie\[\];\n\}/g, `export interface LandingFeeds {
  featured: Movie[];
  bollywood: Movie[];
  hollywood: Movie[];
  adult18: Movie[];
  highestRatedAction: Movie[];
  isMock?: boolean;
}`);
fs.writeFileSync('src/tmdb.ts', tmdbContent);
