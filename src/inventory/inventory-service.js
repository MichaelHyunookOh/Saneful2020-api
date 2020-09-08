const xss = require("xss");

const InventoryService = {

  getAllInventory(db) {
    return db("saneful_inventory").select("*");
  },

  getInventoryByInevtoryId(db, Inventory_id) {
    console.log(Inventory_id);
    return db("saneful_inventory")
    .where({ Inventory_id })
    .first();
  },

  insertInventory(db, newInventory) {
      return db
      .insert(newInventory)
      .into("saneful_inventory")
  },

  getInventoryByUserId(db, userId) {
    return db
    .select('*')
    .from('saneful_inventory')
    .where('user_id', userId)
  },

  serializeInventory(inventory) {
    return {
      inventory_id: inventory.inventory_id,
      user_id: inventory.user_id,
      item: inventory.description,
      quantity: inventory.quantity,
      date_created: new Date(inventory.date_created),
    };
  },
};

module.exports = InventoryService;
