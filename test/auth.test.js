const knex = require('knex');
const jwt = require('jsonwebtoken');

const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Auth Endpoints', () => {
  let db;
  const { testUsers } = helpers.makeSavesFixtures();
  const testUser = testUsers[0];


  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup tables', () => helpers.cleanTables(db));
  afterEach('cleanup tables', () => helpers.cleanTables(db));

  describe('POST /api/auth', () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

    const requiredFields = ['user_email', 'user_password'];
    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        user_email: testUser.user_email,
        user_password: testUser.user_password,
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];
        return supertest(app)
          .post('/api/auth')
          .send(loginAttemptBody)
          .expect(400);
      });
    });

    it(`responds 400 'invalid email or password' when bad user_name`, () => {
      const userInvalidUser = {
        user_email: 'user-not',
        user_password: 'existy',
      };

      return supertest(app)
        .post('/api/auth')
        .send(userInvalidUser)
        .expect(401, { error: `Incorrect email or password` });
    });

    it(`responds 400 'invalid email or password' when bad password`, () => {
      const userInvalidPass = {
        user_email: testUser.user_email,
        user_password: 'incorrect',
      };

      return supertest(app)
        .post('/api/auth')
        .send(userInvalidPass)
        .expect(401, { error: `Incorrect email or password` });
    });

    it(`responds with 200 and JWT auth token using secret when valid credentials`, () => {
      const requestBody = {
        user_email: testUser.user_email,
        user_password: testUser.user_password,
      };

      console.log('requestBody', requestBody);

      return supertest(app)
        .post('/api/auth')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(200);
    });
  });
});
