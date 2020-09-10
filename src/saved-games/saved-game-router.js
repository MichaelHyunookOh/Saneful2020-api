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
      health_points_max,
      sanity_points,
      sanity_points_max,
      energy_points,
      energy_points_max,
      elapsed_time,
    } = req.body;
    const newSave = {
        current_x_coord,
        current_y_coord,
        money_counter,
        health_points,
        health_points_max,
        sanity_points,
        sanity_points_max,
        energy_points,
        energy_points_max,
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
    

    SavedGameService.insertSave(req.app.get('db'), newSave)
      .then((save) => {
          
        res
          .status(201)
          .location(`/api/save/${save.id}`)
          .json(SavedGameService.serializeSavedGame(save));
      })
      .catch(next);
  });

  SavedGameRouter
  .route('/:save_id')
  .all(requireAuth)
  .all((req, res, next) => {
    SavedGameService.getById(req.app.get('db'), req.params.save_id)
    .then((save) => {
      if (!save) {
        return res.status(404).json({
          error: { message: `Save doesn't exist` },
        });
      }
      res.save = save;
      next();
    })
    .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
        current_x_coord,
        current_y_coord,
        money_counter,
        health_points,
        health_points_max,
        sanity_points,
        sanity_points_max,
        energy_points,
        energy_points_max,
        elapsed_time,
      } = req.body;
      const saveToUpdate = {
          current_x_coord,
          current_y_coord,
          money_counter,
          health_points,
          health_points_max,
          sanity_points,
          sanity_points_max,
          energy_points,
          energy_points_max,
          elapsed_time,
      };

    const numberOfValues = Object.values(saveToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body missing values`,
        },
      });
    }

    SavedGameService.updateSave(
      req.app.get('db'),
      req.params.save_id,
      saveToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });
  

module.exports = SavedGameRouter;

