// commands/build.js
import { spawnSync } from "child_process";
import chalk from "chalk";
import fs from "fs-extra";

export function build() {
  console.log(chalk.cyan("\n🏗  Build du projet NeonX...\n"));

  spawnSync("npm", ["run", "build", "--prefix", "frontend"], { stdio: "inherit" });

  if (fs.existsSync("backend")) {
    fs.copySync("backend", "dist/backend");
    console.log(chalk.green("✅ Backend copié dans /dist/backend"));
  }

  if (fs.existsSync("frontend/dist")) {
    fs.copySync("frontend/dist", "dist/frontend");
    console.log(chalk.green("✅ Frontend copié dans /dist/frontend"));
  }

  console.log(chalk.cyanBright("\n✨ Build terminé avec succès !"));
}
