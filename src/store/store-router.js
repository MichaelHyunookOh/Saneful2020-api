const express = require("express");
const path = require("path");
const StoreService = require("./store-service");
const { requireAuth } = require("../auth/jwt-auth");

const StoreRouter = express.Router();
const jsonBodyParser = express.json();

// get all items in online store available for sale
StoreRouter
.route("/").get(requireAuth, (req, res, next) => {
  // only get items with available quantity > 0
  StoreService.getAvailableItems(req.app.get("db"))
    .then((itemList) => {
      res.json(itemList.map(item => StoreService.serializeItem(item)));
    })
    .catch(next);
});

StoreRouter
.route("/").patch(requireAuth, jsonBodyParser, (req, res, next) => {
  StoreService.updateItem(req.app.get("db"), itemId, newQty)
    .then(() => {
      
    })
    .catch(next);
})

module.exports = StoreRouter;
