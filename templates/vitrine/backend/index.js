#!/usr/bin/env node

const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Backend Neon fonctionne !");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
