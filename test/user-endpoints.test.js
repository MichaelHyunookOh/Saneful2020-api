const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('User Endpoints', function() {
  let db

  const { testUsers } = helpers.makeSavesFixtures()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnected from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE saneful_saved_game, saneful_user RESTART IDENTITY CASCADE'))

  afterEach('clean the table', () => db.raw('TRUNCATE saneful_saved_game, saneful_user RESTART IDENTITY CASCADE'))

  describe(`POST /api/user`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )

      const requiredFields = ['user_name', 'user_email', 'user_password']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          user_name: 'test user_name',
          user_email: 'test user_email',
          user_password: 'test password',
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/user')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })

      it(`responds 400 'Password be longer than 5 characters' when empty password`, () => {
        const userShortPassword = {
          user_email: 'test user_name',
          user_name: 'test user_name',
          user_password: '1234',
        }
        return supertest(app)
          .post('/api/user')
          .send(userShortPassword)
          .expect(400, { error: `Password be longer than 8 characters` })
      })

      it(`responds 400 'Password be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          user_email: 'test user_name',
          user_name: 'test user_name',
          user_password: '*'.repeat(73),
        }
        return supertest(app)
          .post('/api/user')
          .send(userLongPassword)
          .expect(400, { error: `Password be less than 72 characters` })
      })

      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          user_email: 'test user_name',
          user_name: 'test user_name',
          user_password: ' 1Aa!2Bb@',
        }
        return supertest(app)
          .post('/api/user')
          .send(userPasswordStartsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          user_email: 'test user_name',
          user_name: 'test user_name',
          user_password: '1Aa!2Bb@ ',
        }
        return supertest(app)
          .post('/api/user')
          .send(userPasswordEndsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          user_email: 'test user_name',
          user_name: 'test user_name',
          user_password: '11AAaabb',
        }
        return supertest(app)
          .post('/api/user')
          .send(userPasswordNotComplex)
          .expect(400, { error: `Password must contain one upper case, lower case, number and special character` })
      })

    //   it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
    //     const duplicateUser = {
    //       user_email: 'test user_email',
    //       user_name: testUser.user_name,
    //       user_password: '11AAaa!!',
    //     }
    //     return supertest(app)
    //       .post('/api/user')
    //       .send(duplicateUser)
    //       .expect(400, { error: `User name already taken` })
    //   })
    })

    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newUser = {
          user_email: 'test user_name',
          user_name: 'test user_name',
          user_password: '11AAaa!!',
        }
        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .expect(201)
          .expect(res => {
            // expect(res.body).to.have.property('user_id')
            // expect(res.body.user_email).to.eql(newUser.user_email)
            // expect(res.body.user_name).to.eql(newUser.user_name)
            expect(res.body).to.not.have.property('user_password')
            // expect(res.headers.location).to.eql(`/api/user/${res.body.user_id}`)
            // const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
            // const actualDate = new Date(res.body.date_created).toLocaleString()
            // expect(actualDate).to.eql(expectedDate)
          })
          .expect(res =>
            db
              .from('saneful_user')
              .select('*')
              .where({ user_id: res.body.user_id })
              .first()
              .then(row => {
                expect(row.user_email).to.eql(newUser.user_email)
                expect(row.user_name).to.eql(newUser.user_name)
                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                const actualDate = new Date(row.date_created).toLocaleString()
                expect(actualDate).to.eql(expectedDate)

                return bcrypt.compare(newUser.user_password, row.user_password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          )
      })
    })
  })
})