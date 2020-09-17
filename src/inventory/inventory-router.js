const express = require("express");
const path = require("path");
const InventoryService = require("./inventory-service");
const { requireAuth } = require("../auth/jwt-auth");

const InventoryRouter = express.Router();
const jsonBodyParser = express.json();

// get inventory belonging to user with user id
InventoryRouter
.route("/").get(requireAuth, (req, res, next) => {
  InventoryService.getInventory(req.app.get("db"), req.user.user_id)
    .then((inventoryList) => {
      res.json(inventoryList.map(inventoryItem => InventoryService.serializeInventory(inventoryItem)));
    })
    .catch(next);
});

async function checkInventoryExists(req, res, next) {
  try {
    const inventory = await InventoryService.getInventoryByInventoryId(
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
.route('/:inventory_id')
.all((req, res, next) => {
  InventoryService.getInventoryById(req.app.get('db'), req.params.inventory_id)
  .then((inventory) => {
    if (!inventory) {
      return res.status(404).json({
        error: { message: `Save doesn't exist` },
      });
    }
    res.inventory = inventory;
    next();
  })
  .catch(next);
}) 
.get(requireAuth, (req, res) => {
  res.json(InventoryService.serializeInventory(res.inventory))
})

InventoryRouter
.route('/:save_id')
.all(requireAuth)
.all((req, res, next) => {
  InventoryService.getSaveById(req.app.get('db'), req.params.save_id)
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
.post(requireAuth, jsonBodyParser, (req, res, next) => {
  const { item, description, quantity } = req.body;
  const newinventory = { item, description, quantity };
  console.log(req.params.save_id)
  

  for (const [key, value] of Object.entries(newinventory))
    if (value == null)
      return res.status(400).json({
        error: `Something is wrong with post Inventory Router`,
      });

    newinventory.saved_game_id = req.params.save_id

  InventoryService.insertInventory(req.app.get("db"), newinventory)
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
