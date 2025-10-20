#!/usr/bin/env node
const inquirer = require("inquirer"); 
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

// Fonction pour lister les pages
function listPages(targetDir) {
  const pagesDir = path.join(targetDir, "frontend", "src", "pages");
  if (!fs.existsSync(pagesDir)) return [];

  return fs.readdirSync(pagesDir).filter(file => fs.statSync(path.join(pagesDir, file)).isDirectory());
}

// Fonction principale
async function main() {
  console.log(chalk.cyanBright("\n🚀 Bienvenue dans NeonX CLI\n"));

  const args = process.argv.slice(2);
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

  // Affichage des pages internes
  const pages = listPages(targetDir);
  if (pages.length > 0) {
    console.log(chalk.blueBright("🗂 Structure des pages dans 'frontend/src/pages' :"));
    pages.forEach(page => console.log(chalk.green(" - " + page)));
  } else {
    console.log(chalk.yellow("⚠️ Aucune page trouvée dans 'frontend/src/pages'."));
  }

  console.log(chalk.blueBright("\n✨ Bon développement avec NeonX ! ✨\n"));
}

main();
