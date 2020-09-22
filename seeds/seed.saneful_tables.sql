BEGIN;

  INSERT INTO saneful_user
    ( user_name, user_email, user_password)
  VALUES
    ('Minh', 'something111@email.com', 'Password123!'),
    ('Michael', 'somethingelse222@email.com', 'Password123!'),
    ('Matthew', 'somethingcool333@email.com', 'Password123!'),
    ('Chrissy', 'something444@email.com', 'Password123!'),
    ('Nick', 'somethingelse555@email.com', 'Password123!');


  INSERT INTO saneful_saved_game
    (current_x_coord, current_y_coord, money_counter, health_points, sanity_points, dead, character_skin, elapsed_time, health_points_max, sanity_points_max, user_id)
  VALUES
    (5, 5, 20, 10, 8, true, 1, 1, 100, 100, 1),
    (4, 4, 20, 10, 8, false, 2, 2, 100, 100, 2),
    (3, 3, 20, 10, 8, false, 3, 3, 100, 100, 3),
    (2, 2, 20, 10, 8, false, 1, 4, 100, 100, 4),
    (2, 2, 20, 10, 8, true, 2, 10, 100, 100, 4),
    (6, 6, 20, 10, 8, true, 3, 5, 100, 100, 5);


  INSERT INTO saneful_inventory
    (saved_game_id, item, description, quantity)
  VALUES
    (1, 'apple', 'delicious and nutritious apple', 4),
    (2, 'x-box', 'gaming console to stay sane', 1),
    (3, 'flowers', 'beautiful plants to stay sane', 5),
    (4, 'adderall', 'gives you energy, decreases health, decreases sanity', 3),
    (5, 'bowflex', 'stay healthy and increase energy', 1);

  COMMIT;
   