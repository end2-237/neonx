const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const listPages = require("../utils/listPages");

async function createProject(args) {
  let projectName = args[0];
  const templateArg = args.includes("--template")
    ? args[args.indexOf("--template") + 1]
    : null;

  if (!projectName) {
    const { name } = await inquirer.prompt([{ name: "name", message: "Nom du projet ?" }]);
    projectName = name;
  }

  let template = templateArg;
  if (!template) {
    const { selectedTemplate } = await inquirer.prompt([
      { type: "list", name: "selectedTemplate", message: "Choisis un template :", choices: ["vitrine", "food", "blank"], default: "blank" },
    ]);
    template = selectedTemplate;
  }

  const targetDir = path.join(process.cwd(), projectName);
  const templateDir = path.join(__dirname, `../../templates/${template}`);

  if (fs.existsSync(targetDir)) {
    console.log(chalk.red("❌ Le dossier existe déjà !"));
    process.exit(1);
  }

  fs.copySync(templateDir, targetDir);
  console.log(chalk.green(`✅ Projet '${projectName}' créé avec succès !`));
  console.log(chalk.yellow(`👉 cd ${projectName} && npm install\n`));

  const pages = listPages(targetDir);
  if (pages.length > 0) {
    console.log(chalk.blueBright("🗂 Pages existantes :"));
    pages.forEach((p) => console.log(chalk.green(" - " + p)));
  }
}

module.exports = createProject;
