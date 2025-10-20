#!/usr/bin/env node
const inquirer = require("inquirer");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

// Fonction pour lister les pages existantes
function listPages(targetDir) {
  const pagesDir = path.join(targetDir, "frontend", "src", "pages");
  if (!fs.existsSync(pagesDir)) return [];
  return fs
    .readdirSync(pagesDir)
    .filter((file) => fs.statSync(path.join(pagesDir, file)).isDirectory());
}

// 👉 Fonction pour mettre à jour automatiquement le routeur React
// 👉 Fonction pour mettre à jour automatiquement le fichier de routes
function updateRouter(pageName) {
    const routesPath = path.join(process.cwd(), "frontend", "src", "routes", "routes.jsx");
  
    // Si le fichier n'existe pas encore, on le crée avec une structure de base
    if (!fs.existsSync(routesPath)) {
      fs.ensureDirSync(path.dirname(routesPath));
      fs.writeFileSync(
        routesPath,
        `
  import React from "react";
  import { Routes, Route } from "react-router-dom";
  
  export default function AppRoutes() {
    return (
      <Routes>
        {/* Les routes seront ajoutées automatiquement ici */}
      </Routes>
    );
  }
  `,
        "utf8"
      );
    }
  
    let content = fs.readFileSync(routesPath, "utf8");
  
    const importLine = `import ${pageName} from "../pages/${pageName}";`;
    const routeLine = `      <Route path="/${pageName.toLowerCase()}" element={<${pageName} />} />`;
  
    // Vérifie si l'import existe déjà
    if (!content.includes(importLine)) {
      // Ajoute l'import juste avant le premier "export default"
      content = content.replace(/export default/, `${importLine}\n\nexport default`);
    }
  
    // Vérifie si la route existe déjà
    if (!content.includes(routeLine)) {
      // Injecte la route avant la fermeture de <Routes>
      content = content.replace(/<\/Routes>/, `${routeLine}\n    </Routes>`);
    }
  
    fs.writeFileSync(routesPath, content, "utf8");
    console.log(chalk.green(`🔗 Route '/${pageName.toLowerCase()}' ajoutée dans routes.jsx`));
  }
  

// Fonction pour créer une nouvelle page
function createPage(pageName) {
  const pagesDir = path.join(process.cwd(), "frontend", "src", "pages");
  const pageDir = path.join(pagesDir, pageName);

  if (fs.existsSync(pageDir)) {
    console.log(chalk.yellow(`⚠️ La page '${pageName}' existe déjà.`));
    process.exit(0);
  }

  fs.ensureDirSync(pageDir);

  const componentName =
    pageName.charAt(0).toUpperCase() + pageName.slice(1).toLowerCase();
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

  console.log(chalk.green(`✅ Page '${pageName}' créée avec succès !`));
  console.log(chalk.cyan(`📁 Chemin : frontend/src/pages/${pageName}/${pageName}.jsx`));

  // 🔄 Mise à jour du routeur React
  updateRouter(pageName);
}

// Fonction principale
async function main() {
  console.log(chalk.cyanBright("\n🚀 Bienvenue dans NeonX CLI\n"));

  const args = process.argv.slice(2);

  // 🧩 Commande : neonx create-page <PageName>
  if (args[0] === "create-page") {
    const pageName = args[1];
    if (!pageName) {
      console.log(chalk.red("❌ Spécifie le nom de la page. Exemple : neonx create-page Home"));
      process.exit(1);
    }
    createPage(pageName);
    process.exit(0);
  }

  // 🧱 Commande : neonx <nom_du_projet> [--template vitrine/food/balafon]
  let argName = args[0];
  const templateArg = args.includes("--template")
    ? args[args.indexOf("--template") + 1]
    : null;

  if (!argName) {
    const { projectName } = await inquirer.prompt([
      { name: "projectName", message: "Nom du projet ?" },
    ]);
    argName = projectName;
  }

  let template = templateArg;
  if (!template) {
    const { selectedTemplate } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedTemplate",
        message: "Choisis un template :",
        choices: ["vitrine", "food", "balafon"],
        default: "vitrine",
      },
    ]);
    template = selectedTemplate;
  }

  const targetDir = path.join(process.cwd(), argName);
  if (fs.existsSync(targetDir)) {
    console.log(chalk.red("❌ Le dossier existe déjà !"));
    process.exit(1);
  }

  const templateDir = path.join(__dirname, `../templates/${template}`);
  if (!fs.existsSync(templateDir)) {
    console.log(chalk.red(`❌ Le template '${template}' est introuvable.`));
    process.exit(1);
  }

  fs.copySync(templateDir, targetDir);

  console.log(chalk.green(`\n✅ Projet '${argName}' créé avec succès !`));
  console.log(chalk.yellow(`👉 cd ${argName} && npm install\n`));

  // Affichage de la structure des pages
  const pages = listPages(targetDir);
  if (pages.length > 0) {
    console.log(chalk.blueBright("🗂 Structure des pages dans 'frontend/src/pages' :"));
    pages.forEach((page) => console.log(chalk.green(" - " + page)));
  } else {
    console.log(chalk.yellow("⚠️ Aucune page trouvée dans 'frontend/src/pages'."));
  }

  console.log(chalk.blueBright("\n✨ Bon développement avec NeonX ! ✨\n"));
}

main();
