const express = require("express");
const path = require("path");
const SavedGameService = require("./saved-game-services");
const { requireAuth } = require("../auth/jwt-auth");

const SavedGameRouter = express.Router();
const jsonParser = express.json();

SavedGameRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    SavedGameService.getSavedGame(req.app.get("db"), req.user.user_id)
      .then((savedGame) => {
        res.json(savedGame.map(game => SavedGameService.serializeSavedGame(game)));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const {
      current_x_coord,
      current_y_coord,
      money_counter,
      health_points,
      sanity_points,
      energy_points,
      elapsed_time,
    } = req.body;
    const newSave = {
        current_x_coord,
        current_y_coord,
        money_counter,
        health_points,
        sanity_points,
        energy_points,
        elapsed_time,
    };

    for (const [key, value] of Object.entries(newSave)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    newSave.user_id = req.user.user_id;
    console.log(newSave)

    SavedGameService.insertSave(req.app.get('db'), newSave)
      .then((save) => {
          console.log(save)
        res
          .status(201)
          .location(`/api/save/${save.id}`)
          .json(SavedGameService.serializeSavedGame(save));
      })
      .catch(next);
  });

module.exports = SavedGameRouter;

