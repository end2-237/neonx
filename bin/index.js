#!/usr/bin/env node
const chalk = require("chalk");

const createPage = require("./commands/createPage");
const deletePage = require("./commands/deletePage");
const {dev} = require("./commands/dev");
const {build} = require("./commands/build");
const {addModule} = require("./commands/addModule");
const {createApi} = require("./commands/createApi");
const createProject = require("./commands/createProject");

(async () => {
  console.log(chalk.cyanBright("\n🚀 Bienvenue dans NeonX CLI ⚡\n"));
  const args = process.argv.slice(2);

  const command = args[0];
  const arg = args[1];

  switch (command) {
    case "create-page": return createPage(arg);
    case "delete-page": return deletePage(arg);
    case "dev": return dev();
    case "build": return build();
    case "add-module": return addModule(arg);
    case "create-api": return createApi(arg);
    default: return createProject(args);
  }
})();
