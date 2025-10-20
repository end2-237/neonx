#!/usr/bin/env node
import express from "express";
import dotenv from "dotenv";
import neonxConfig from "./config/neonx.config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || neonxConfig.server.port || 3000;

// Middleware de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`🚀 Backend NeonX fonctionne sur le port ${PORT}`);
});

// activation conditionnelle d’un module (auth)
if (neonxConfig.features.auth) {
  app.get("/login", (req, res) => {
    res.send("Page de connexion activée (auth = true)");
  });
}


// Route pour afficher la configuration actuelle
app.get("/neonx/config", (req, res) => {
    res.json({
      message: "🧠 Configuration active du framework NeonX",
      config: neonxConfig,
    });
  });

app.listen(PORT, () => {
  console.log(`✅ Serveur NeonX démarré sur le port ${PORT}`);
});
