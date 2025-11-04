const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const updateRouter = require("../utils/updateRouter");

function createPage(pageName) {
  if (!pageName) {
    console.log(chalk.red("❌ Spécifie un nom de page : neonx create-page Home"));
    process.exit(1);
  }

  const pagesDir = path.join(process.cwd(), "frontend", "src", "pages");
  const pageDir = path.join(pagesDir, pageName);

  if (fs.existsSync(pageDir)) {
    console.log(chalk.yellow(`⚠️ La page '${pageName}' existe déjà.`));
    process.exit(0);
  }

  fs.ensureDirSync(pageDir);

  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1).toLowerCase();
  const filePath = path.join(pageDir, "index.jsx");

  const content = `
import React from "react";

export default function ${componentName}() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur la page ${componentName}</h1>
      <p className="text-lg">Ceci est une page générée automatiquement par NeonX ⚡</p>
    </div>
  );
}
`;

  fs.writeFileSync(filePath, content, "utf8");
  updateRouter(pageName);

  console.log(chalk.green(`✅ Page '${pageName}' créée avec succès !`));
}

module.exports = createPage;
