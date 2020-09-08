const express = require("express");
const path = require("path");
const InventoryService = require("./inventory-service");
const { requireAuth } = require("../auth/jwt-auth");

const InventoryRouter = express.Router();
const jsonBodyParser = express.json();

InventoryRouter.route("/").get((req, res, next) => {
  InventoryService.getAllInventory(req.app.get("db"))
    .then((inventory) => {
      res.json(inventory.map(InventoryService.serializeinventory));
    })
    .catch(next);
});

async function checkInventoryExists(req, res, next) {
  try {
    const inventory = await InventoryService.getInventoryByInevtoryId(
      req.app.get("db"),
      req.params.inventory_id
    );

    if (!inventory) {
      return res.status(501).json({
        error: `inventory doesn't exist`,
      });
    }
    res.inventory = inventory;
    next();
  } catch (error) {
    next(error);
  }
}

InventoryRouter
  .route("/:inventory_id")
  .all(requireAuth)
  .all(checkinventoryExists)
  .get((req, res) => {
    const result = InventoryService.serializeinventory(res.inventory);
    console.log(result);
    res.json(result);
  });

InventoryRouter.route("/")
.post(requireAuth, jsonBodyParser, (req, res, next) => {
  const user_id = req.user.user_id;
  const { item, description, quantity } = req.body;
  const newinventory = { user_id, item, description, quantity };

  for (const [key, value] of Object.entries(newinventory))
    if (value == null)
      return res.status(400).json({
        error: `Something is wrong with post Inventory Router`,
      });

  return InventoryService.insertInventory(req.app.get("db"), newinventory)
    .then((inventory) => {
      // Debug here
      console.log("inventory:", inventory.inventory_id);
      res
        .status(201)
        .json({ message: "Your inventory has been saved!" })
        .location(path.posix.join(req.originalUrl, `/${inventory.inventory_id}`))
        .json(InventoryService.serializeinventory(inventory));
    })
    .catch(next);
});

module.exports = InventoryRouter;
