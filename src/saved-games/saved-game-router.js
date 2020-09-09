const express = require("express");
const path = require("path");
const SavedGameService = require("./saved-game-service");
const { requireAuth } = require("../auth/jwt-auth");

const SavedGameRouter = express.Router();
const jsonBodyParser = express.json();

SavedGameRouter
.route("/").get(requireAuth, (req, res, next) => {
    SavedGameService.getSavedGame(req.app.get("db"), req.user.user_id)
      .then((savedGame) => {
        res.json(savedGame.map(game => InventoryService.serializeInventory(game)));
      })
      .catch(next);
  });

