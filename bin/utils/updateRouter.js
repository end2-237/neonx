const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

function updateRouter(pageName) {
  const routesPath = path.join(process.cwd(), "frontend", "src", "routes", "routes.jsx");

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

  if (!content.includes(importLine)) {
    content = content.replace(/export default/, `${importLine}\n\nexport default`);
  }

  if (!content.includes(routeLine)) {
    content = content.replace(/<\/Routes>/, `${routeLine}\n    </Routes>`);
  }

  fs.writeFileSync(routesPath, content, "utf8");
  console.log(chalk.green(`🔗 Route '/${pageName.toLowerCase()}' ajoutée dans routes.jsx`));
}

module.exports = updateRouter;
