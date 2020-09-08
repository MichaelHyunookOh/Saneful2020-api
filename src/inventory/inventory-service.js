const xss = require("xss");

const InventoryService = {

  getAllInventory(db) {
    return db("saneful_inventory").select("*");
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
            'user_id', usr.user_id,
            'user_name', usr.user_name,
            'user_email', usr.user_email,
            'date_created', usr.date_created
          )
        ) AS "user"`
      )
    )
    .leftJoin('saneful_user AS usr', 'inv.user_id', 'usr.user_id')
    .where('usr.user_id', id)
    .groupBy('inv.inventory_id', 'usr.user_id');
  },

  getInventoryByInventoryId(db, Inventory_id) {
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
    const { user } = inventory;
    return {
      inventory_id: inventory.inventory_id,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        date_created: user.date_created
      },
      item: inventory.description,
      quantity: inventory.quantity,
      date_created: new Date(inventory.date_created),
    };
  },
};

module.exports = InventoryService;
