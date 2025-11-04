const fs = require("fs-extra");
const path = require("path");

function listPages(targetDir) {
  const pagesDir = path.join(targetDir, "frontend", "src", "pages");
  if (!fs.existsSync(pagesDir)) return [];
  return fs
    .readdirSync(pagesDir)
    .filter((file) => fs.statSync(path.join(pagesDir, file)).isDirectory());
}

module.exports = listPages;
