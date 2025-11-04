// commands/addModule.js
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export function addModule(moduleName) {
  const moduleDir = path.join(process.cwd(), "backend", "modules", moduleName);

  if (fs.existsSync(moduleDir)) {
    console.log(chalk.yellow(`⚠️ Le module '${moduleName}' existe déjà.`));
    process.exit(0);
  }

  fs.ensureDirSync(moduleDir);

  const controllerContent = `
export const getAll = (req, res) => {
  res.json({ message: "Liste des ${moduleName}s" });
};
`;

  const routeContent = `
import express from "express";
import * as ${moduleName}Controller from "./${moduleName}.controller.js";

const router = express.Router();

router.get("/", ${moduleName}Controller.getAll);

export default router;
`;

  fs.writeFileSync(path.join(moduleDir, `${moduleName}.controller.js`), controllerContent);
  fs.writeFileSync(path.join(moduleDir, `${moduleName}.routes.js`), routeContent);

  console.log(chalk.green(`✅ Module '${moduleName}' créé dans backend/modules/${moduleName}/`));
}
