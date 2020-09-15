const xss = require("xss");

const SavedGameService = {
    getAllSavedGames(db) {
        return db
        .from('saneful_saved_game AS sav')
        .select(
          'sav.saved_game_id',
          'sav.current_x_coord',
          'sav.current_y_coord',
          'sav.money_counter',
          'sav.health_points',
          'sav.health_points_max',
          'sav.sanity_points',
          'sav.sanity_points_max',
          'sav.character_skin',
          'sav.dead',
          'sav.elapsed_time',
          
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
        .leftJoin('saneful_user AS usr', 'sav.user_id', 'usr.user_id')
        .groupBy('sav.saved_game_id', 'usr.user_id');
        },
    
    getSavedGame(db, id) {
    return db
    .from('saneful_saved_game AS sav')
    .select(
        'sav.saved_game_id',
        'sav.current_x_coord',
        'sav.current_y_coord',
        'sav.money_counter',
        'sav.health_points',
        'sav.health_points_max',
        'sav.sanity_points',
        'sav.sanity_points_max',
        'sav.character_skin',
        'sav.dead',
        'sav.elapsed_time',
      
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
    .leftJoin('saneful_user AS usr', 'sav.user_id', 'usr.user_id')
    .where('usr.user_id', id)
    .groupBy('sav.saved_game_id', 'usr.user_id');
    },

    // getLeaderboard(db) {
    // return db
    // .from('saneful_saved_game AS sav')
    // .max('sav.elapsed_time')
    // .select(
    //     'sav.saved_game_id',
    //     'sav.current_x_coord',
    //     'sav.current_y_coord',
    //     'sav.money_counter',
    //     'sav.health_points',
    //     'sav.health_points_max',
    //     'sav.sanity_points',
    //     'sav.sanity_points_max',
    //     'sav.elapsed_time',
      
    //   db.raw(
    //     `json_strip_nulls(
    //       json_build_object(
    //         'user_id', usr.user_id,
    //         'user_name', usr.user_name,
    //         'user_email', usr.user_email,
    //         'date_created', usr.date_created
    //       )
    //     ) AS "user"`
    //   )
    // )

    // .leftJoin('saneful_user AS usr', 'sav.user_id', 'usr.user_id')
    // .groupBy('user_name', 'sav.elapsed_time', 'sav.saved_game_id','usr.user_id');
    // },

    getLeaderboard(db) {
        return db
        .from('saneful_saved_game')
        .select('user_name', 'elapsed_time', 'dead')
        .innerJoin(db.raw('(select user_id, MAX(elapsed_time) as MaxTime from saneful_saved_game group by user_id) as groupedssg on saneful_saved_game.user_id = groupedssg.user_id and saneful_saved_game.elapsed_time = groupedssg.MaxTime'))
        .leftJoin('saneful_user', 'saneful_saved_game.user_id', 'saneful_user.user_id')
        .orderBy('elapsed_time', 'desc')
    
    },

    serializeSavedGame(save) {
        const { user } = save;
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
        };
      },

    serializeLeaderboard(score) {
        const { user } = score;
        return {
          saved_game_id: score.saved_game_id,
          current_x_coord: score.current_x_coord,
          current_y_coord: score.current_y_coord,
          money_counter: score.money_counter,
          health_points: score.health_points,
          health_points_max: score.health_points_max,
          sanity_points: score.sanity_points,
          sanity_points_max: score.sanity_points_max,
          character_skin: score.character_skin,
          dead: score.dead,
          elapsed_time: score.elapsed_time,
          user_name: score.user_name,
      
        };
    },

    getById(db, saved_game_id) {
        return SavedGameService.getAllSavedGames(db)
          .where('sav.saved_game_id', saved_game_id)
          .first();
      },

    insertSave(db, newSave) {
        return db
          .insert(newSave)
          .into('saneful_saved_game')
          .returning('*')
          .then(([row]) => row)
          .then((row) => SavedGameService.getById(db, row.saved_game_id));
      },

    updateSave(knex, saved_game_id, newFields) {
        return knex('saneful_saved_game').where({ saved_game_id }).update(newFields);
      },
};

module.exports = SavedGameService;