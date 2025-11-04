// commands/dev.js
import { spawn } from "child_process";
import chalk from "chalk";

export function dev() {
  console.log(chalk.cyan("\n🚀 Démarrage du mode développement...\n"));

  // Lancement du backend
  const backend = spawn("node", ["backend/index.js"], { stdio: "inherit" });

  // Lancement du frontend (compatible Windows)
  const frontend = spawn(
    process.platform === "win32" ? "cmd" : "npm",
    process.platform === "win32" ? ["/c", "npm", "run", "dev", "--prefix", "frontend"] : ["run", "dev", "--prefix", "frontend"],
    { stdio: "inherit" }
  );

  backend.on("close", (code) => console.log(chalk.red(`🧩 Backend terminé (code ${code})`)));
  frontend.on("close", (code) => console.log(chalk.red(`🎨 Frontend terminé (code ${code})`)));
}
