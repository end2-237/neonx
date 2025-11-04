const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

function deletePage(pageName) {
  if (!pageName) {
    console.log(chalk.red("❌ Spécifie un nom de page : neonx delete-page Home"));
    process.exit(1);
  }

  const pagesDir = path.join(process.cwd(), "frontend", "src", "pages");
  const pageDir = path.join(pagesDir, pageName);
  const routesPath = path.join(process.cwd(), "frontend", "src", "routes", "routes.jsx");

  if (!fs.existsSync(pageDir)) {
    console.log(chalk.red(`❌ La page '${pageName}' n'existe pas.`));
    process.exit(1);
  }

  fs.removeSync(pageDir);
  console.log(chalk.green(`🗑 Page '${pageName}' supprimée.`));

  if (fs.existsSync(routesPath)) {
    let content = fs.readFileSync(routesPath, "utf8");
    const importRegex = new RegExp(`import\\s+${pageName}\\s+from\\s+"\\.\\./pages/${pageName}".*\\n?`, "g");
    const routeRegex = new RegExp(`<Route path="/${pageName.toLowerCase()}" element={<${pageName} />} />\\n?`, "g");
    fs.writeFileSync(routesPath, content.replace(importRegex, "").replace(routeRegex, ""), "utf8");
    console.log(chalk.yellow(`🚮 Route '${pageName}' supprimée du routeur.`));
  }
}

module.exports = deletePage;
