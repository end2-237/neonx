// commands/createApi.js
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export function createApi(apiName) {
  const modelDir = path.join(process.cwd(), "backend", "models");
  const controllerDir = path.join(process.cwd(), "backend", "controllers");
  const routesDir = path.join(process.cwd(), "backend", "routes");

  fs.ensureDirSync(modelDir);
  fs.ensureDirSync(controllerDir);
  fs.ensureDirSync(routesDir);

  const ModelName = apiName.charAt(0).toUpperCase() + apiName.slice(1).toLowerCase();

  // --- Model
  const modelContent = `
export const ${ModelName}Model = [
  // Exemple de données temporaires
  { id: 1, name: "Exemple 1" },
  { id: 2, name: "Exemple 2" }
];
`;

  // --- Controller CRUD
  const controllerContent = `
import { ${ModelName}Model } from "../models/${apiName}.model.js";

export const getAll = (req, res) => res.json(${ModelName}Model);

export const getOne = (req, res) => {
  const item = ${ModelName}Model.find(i => i.id == req.params.id);
  item ? res.json(item) : res.status(404).json({ error: "Introuvable" });
};

export const create = (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  ${ModelName}Model.push(newItem);
  res.json(newItem);
};

export const update = (req, res) => {
  const index = ${ModelName}Model.findIndex(i => i.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Introuvable" });
  ${ModelName}Model[index] = { ...${ModelName}Model[index], ...req.body };
  res.json(${ModelName}Model[index]);
};

export const remove = (req, res) => {
  const index = ${ModelName}Model.findIndex(i => i.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Introuvable" });
  ${ModelName}Model.splice(index, 1);
  res.json({ success: true });
};
`;

  // --- Route
  const routeContent = `
import express from "express";
import * as controller from "../controllers/${apiName}.controller.js";

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
`;

  fs.writeFileSync(path.join(modelDir, `${apiName}.model.js`), modelContent);
  fs.writeFileSync(path.join(controllerDir, `${apiName}.controller.js`), controllerContent);
  fs.writeFileSync(path.join(routesDir, `${apiName}.routes.js`), routeContent);

  console.log(chalk.green(`✅ API '${apiName}' générée avec succès !`));
  console.log(chalk.cyan(`📦 Model + Controller + Route créés.`));
}
