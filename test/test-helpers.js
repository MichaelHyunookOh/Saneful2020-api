<<<<<<< HEAD
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      user_id: 1,
      user_name: 'miloh',
      user_email: 'hi@gmail.com',
      user_password: 'Hello123!',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      user_id: 2,
      user_name: 'michaeloh',
      user_email: 'hello@gmail.com',
      user_password: 'Hithere123!',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      user_id: 3,
      user_name: 'apple',
      user_email: 'apple@gmail.com',
      user_password: 'Apple123!',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}


function makeSavesArray(users) {
  return [
    {
        saved_game_id: 1,
        current_x_coord: 5,
        current_y_coord: 5,
        money_counter: 70,
        health_points: 70,
        health_points_max: 100,
        sanity_points: 75,
        sanity_points_max: 100,
        character_skin: 1,
        dead: true,
        elapsed_time: 20,
        user_id: users[0].user_id,
    },
    {
        saved_game_id: 2,
        current_x_coord: 5,
        current_y_coord: 5,
        money_counter: 70,
        health_points: 70,
        health_points_max: 100,
        sanity_points: 75,
        sanity_points_max: 100,
        character_skin: 1,
        dead: true,
        elapsed_time: 20,
        user_id: users[1].user_id,
    },
    {
        saved_game_id: 3,
        current_x_coord: 5,
        current_y_coord: 5,
        money_counter: 70,
        health_points: 70,
        health_points_max: 100,
        sanity_points: 75,
        sanity_points_max: 100,
        character_skin: 1,
        dead: true,
        elapsed_time: 20,
        user_id: users[2].user_id,
    },
  ];
}

function makeExpectedSave(users, save=[]) {
  const user = users
    .find(user => user.user_id === save.user_id)

  return {
          saved_game_id: save.saved_game_id,
          current_x_coord: save.current_x_coord,
          current_y_coord: save.current_y_coord,
          money_counter: save.money_counter,
          health_points: save.health_points,
          health_points_max: save.health_points_max,
          sanity_points: save.sanity_points,
          sanity_points_max: save.sanity_points_max,
          character_skin: save.character_skin,
          dead: save.dead,
          elapsed_time: save.elapsed_time,
          user: {
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            date_created: user.date_created
          },
  }
}

function makeSavesFixtures() {
  const testUsers = makeUsersArray()
  const testSaves = makeSavesArray(testUsers)
  return { testUsers, testSaves }
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    user_password: bcrypt.hashSync(user.user_password, 1)
  }))
  return db.transaction(async trx => {
    await trx('saneful_user').insert(preppedUsers)
    await trx.raw(
      `SELECT setval('saneful_user_user_id_seq', ?)`,
      [users[users.length-1].user_id]
    )
  })
}

function seedSavesTables(db, users, saves=[]) {
  return seedUsers(db, users)
    .then(() => 
      db
        .into('saneful_saved_game')
        .insert(saves)
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.user_id }, secret, {
    subject: user.user_email,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}


module.exports = {
  makeSavesArray,
  makeUsersArray,
  makeAuthHeader,
  seedUsers,
  seedSavesTables,
  makeSavesFixtures,
  makeExpectedSave,
}

=======
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
>>>>>>> fd5f38d0d71b05e3df9770b04f182a5e67736d7d
