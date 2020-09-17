const xss = require("xss");
const SavedGameService = require('../saved-games/saved-game-services')

const InventoryService = {

  getAllInventory(db) {
    return db
    .from('saneful_inventory AS inv')
    .select(
      'inv.inventory_id',
      'inv.item',
      'inv.description',
      'inv.quantity',
      
      db.raw(
        `json_strip_nulls(
          json_build_object(
            'saved_game_id', sav.saved_game_id
          )
        ) AS "save"`
      )
    )
    .leftJoin('saneful_saved_game AS sav', 'inv.saved_game_id', 'sav.saved_game_id')
    .groupBy('inv.inventory_id', 'sav.saved_game_id');
  },

 // user id
  getInventory(db, id) {
    return db
    .from('saneful_inventory AS inv')
    .select(
      'inv.inventory_id',
      'inv.item',
      'inv.description',
      'inv.quantity',
      
      db.raw(
        `json_strip_nulls(
          json_build_object(
            'saved_game_id', sav.saved_game_id
          )
        ) AS "save"`
      )
    )
    .leftJoin('saneful_saved_game AS sav', 'inv.saved_game_id', 'sav.saved_game_id')
    .where('sav.saved_game_id', id)
    .groupBy('inv.inventory_id', 'sav.saved_game_id');
  },

  getInventoryById(db, inventory_id) {
    return InventoryService.getAllInventory(db)
    .where('inv.inventory_id', inventory_id)
    .first();
  },

  insertInventory(db, newInventory) {
      return db
      .insert(newInventory)
      .into("saneful_inventory")
      .returning('*')
      .then(([row]) => row)
      .then((row) => InventoryService.getInventoryById(db, row.inventory_id));
  },

  getInventoryByUserId(db, userId) {
    return db
    .select('*')
    .from('saneful_inventory')
    .where('user_id', userId)
  },

  getSaveById(db, saved_game_id) {
    return SavedGameService.getAllSavedGames(db)
      .where('sav.saved_game_id', saved_game_id)
      .first();
  },

  serializeInventory(inventory) {
    const { save } = inventory;
    return {
      inventory_id: inventory.inventory_id,
      save: {
        saved_game_id: save.saved_game_id
      },
      item: inventory.description,
      quantity: inventory.quantity,
      date_created: new Date(inventory.date_created),
    };
  },
};

module.exports = InventoryService;
