const StoreService = {

  getAvailableItems(db) {
    db
      .select('*')
      .from('saneful_store')
      .where('item_available_qty', '>', 0)
      .orWhere('is_unlimited', true)
  },

  updateItem(db, itemId, newQty) {
    db('store')
      .update('item_available_qty', newQty)
      .where('item_id', itemId)
  },

  serializeItem(item) {
    return {
      item_id: item.item_id,
      item_name: item.item_name,
      item_description: item.item_description,
      item_price: item.item_price,
      is_unlimited: item.is_unlimited,
      item_available_qty: item.item_available_qty,
      can_use_anywhere: item.can_use_anywhere,
      use_at: item.use_at
    }
  }
}

module.exports = StoreService;