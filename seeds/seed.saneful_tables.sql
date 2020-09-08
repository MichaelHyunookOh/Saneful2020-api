BEGIN;

INSERT INTO saneful_user
  ( user_name, user_email, user_password)
  VALUES
    ('Minh','something111@email.com', 'Password123!'),
    ('Michael','somethingelse222@email.com', 'Password123!'),
    ('Matthew','somethingcool333@email.com', 'Password123!'),
    ('Chrissy','something444@email.com', 'Password123!'),
    ('Nick','somethingelse555@email.com', 'Password123!');

INSERT INTO saneful_inventory(user_id, item, description, quantity )
  VALUES
    ('1', 'apple','delicious and nutritious apple', 4),
    ('2', 'x-box', 'gaming console to stay sane', 1),
    ('3', 'flowers ;)', 'beautiful plants to stay sane', 5),
    ('4', 'adderall', 'gives you energy, decreases health, decreases sanity', 3),
    ('5', 'bowflex', 'stay healthy and increase energy', 1);


INSERT INTO saneful_saved_game
  (current_x_coord, current_y_coord, money_counter, health_points, sanity_points, energy_points, elapsed_time, user_id)
  VALUES
    (5, 5, 20, 10, 8, 7, 11, '1'),
    (4, 4, 20, 10, 8, 7, 11, '2'),
    (3, 3, 20, 10, 8, 7, 11, '3'),
    (2, 2, 20, 10, 8, 7, 11, '4'),
    (6, 6, 20, 10, 8, 7, 11, '5');

    COMMIT;
   