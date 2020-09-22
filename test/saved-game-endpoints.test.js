const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe('Save endpoints', function () {
  let db;

  const { testUsers, testSaves } = helpers.makeSavesFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnected from db', () => db.destroy());

  before('clean the table', () =>
    db.raw('TRUNCATE saneful_saved_game, saneful_user RESTART IDENTITY CASCADE')
  );

  afterEach('clean the table', () =>
    db.raw('TRUNCATE saneful_saved_game, saneful_user RESTART IDENTITY CASCADE')
  );

  describe(`GET /api/save`, () => {
    context(`Given no saves`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/save')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context('Given there are saves in the database', () => {
      beforeEach('insert saves', () =>
        helpers.seedSavesTables(db, testUsers, testSaves)
      );

      it('responds with 200 and all the saves', () => {
        const expectedSubscriptions = testSaves.map((save) =>
          helpers.makeExpectedSave(testUsers, save)
        );
        return supertest(app)
          .get('/api/save')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200);
      });
    });
  });

  describe(`POST /api/save`, () => {
    beforeEach('insert subscriptions', () =>
      helpers.seedSavesTables(db, testUsers)
    );
    it(`creates a save, responding with 201 and the new save`, () => {
      const testUser = testUsers[0];
      const newSave = {
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
        user_id: testUser.user_id,
      };

      return supertest(app)
        .post('/api/save')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newSave)
        .expect(201);
    });

    const requiredFields = [
      'subscription_name',
      'subscription_price',
      'category',
    ];
  });

  describe(`PATCH /api/save/:save_id`, () => {
    context(`Given no saves`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it(`responds with 404`, () => {
        const saveId = 123456;
        return supertest(app)
          .patch(`/api/save/${saveId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404);
      });
    });

    context('Given there are saves in the database', () => {
      beforeEach('insert saves', () => {
        return db
          .into('saneful_user')
          .insert(testUsers)
          .then(() => {
            return db.into('saneful_saved_game').insert(testSaves);
          });
      });

      it('responds with 204 and updates the subscription', () => {
        const idToUpdate = 2;
        const updateSave = {
          current_x_coord: 5,
          current_y_coord: 5,
          money_counter: 70,
          health_points: 80,
          health_points_max: 100,
          sanity_points: 75,
          sanity_points_max: 100,
          character_skin: 1,
          dead: true,
          elapsed_time: 20,
        };
        const expectedSubscription = {
          ...testSaves[idToUpdate - 1],
          ...updateSave,
        };
        return supertest(app)
          .patch(`/api/save/${idToUpdate}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(updateSave)
          .expect(204);
      });
    });
  });
});
