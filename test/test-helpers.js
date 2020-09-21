const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      user_id: 1,
      user_name: "miloh",
      user_email: "hi@gmail.com",
      user_password: "Hello123!",
      date_created: "2029-01-22T16:28:32.615Z",
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

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        saneful_users,
        saneful_saved_games,
        saneful_inventory,
        saneful_store
      `
    )
    .then(() =>
      // these alter sequences probably won't work
      Promise.all([
        trx.raw(`ALTER SEQUENCE blogful_articles_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE blogful_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE blogful_comments_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('blogful_articles_id_seq', 0)`),
        trx.raw(`SELECT setval('blogful_users_id_seq', 0)`),
        trx.raw(`SELECT setval('blogful_comments_id_seq', 0)`),
      ])
    )
  )
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

