const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

function cleanTables(db) {
    return db.raw(
      `TRUNCATE
        saneful_user,
        saneful_inventory,
        saneful_saved_game,
        RESTART IDENTITY CASCADE;
        `
    );
  }

function makeAuthHeaders(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user_id }, secret, {
      subject: user.user_email,
      algorithm: "HS256",
    });
    return `Bearer ${token}`;
  }
  
//   function makeAuthHeaders(user, secret = process.env.JWT_SECRET) {
//     //create jwt
//      const token = jwt.sign(
//        {user_id: user.user_id}, 
//        secret, 
//        {subject: user.user_email, algorithm: 'HS256'}
//      );
//      return `Bearer ${token}`;
//    }

module.exports = {
    cleanTables,
    makeAuthHeaders
}