# Saneful 2020

### Project by Nick S., Chrissy H., Michael O., Minh N. and Matt R..

Live Link:
https://saneful.vercel.app/

Heroku Link:
https://mighty-reaches-06724.herokuapp.com/

GitHub Client Link:
https://github.com/thinkful-ei-panda/Saneful2020-client

GitHub API Link:
https://github.com/MattDizzle/Saneful2020-api

Users can register an account which will save thier progress.

Users can login and play Saneful.

Users lose game when they run out of sanity.

_______________________________________________________________________________
_______________________________________________________________________________

## Screenshots

Dash:
![Saneful Screenshot: Dash]()

Login:
![Saneful Screenshot: Login]()

Game Window:
![Saneful Screenshot: Game Window]()

Registration:
![Saneful Screenshot: Registration]()

________________________________________________________________________________
________________________________________________________________________________

## API Documentation

POST  
https://mighty-reaches-06724.herokuapp.com/api/user

Required body format:
{   
    "user_name": "MattDizzle",
    "user_email": "mattdizzledev102@gmail.com",
    "user_password": "Test123!"
}

POST  
https://mighty-reaches-06724.herokuapp.com/api/auth

Required body format:
{
    "user_email": "mattdizzledev101@gmail.com",
    "user_password": "Test123!"
}

This endpoint returns an authToken and the user_id in json format.

POST  
https://mighty-reaches-06724.herokuapp.com/api/save

Bearer Token required. The Bearer token is the authToken returned on login.

Required body format:
{   
    "saved_game_id": "6",
    "current_x_coord": "1",
    "current_y_coord": "2",
    "money_counter": "33",
    "health_points": "44",
    "sanity_points": "32",
    "energy_points": "99",
    "health_points_max":"99"
    "elapsed_time": "3",
    "user_id": "6"
}

This endpoint saves the game in the database.


## About the Technology Stack

Front-end technologies:

HTML5, CSS3, SCSS, Javascript, React, JSX

Server technologies:

​Express, Morgan, Helmet, Path, JsonWebToken, XSS, pg, Dotenv, Cors, Postgrator, Supertest

Data Persistence:

PostgreSQL

Hosting/SaaS:
Vercel
Heroku

​Development Environment

Node.js

## Local dev setup

If using user `dunder-mifflin`:

```bash
mv example.env .env
createdb -U dunder-mifflin saneful
createdb -U dunder-mifflin saneful-test
```

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env MIGRATION_DB_NAME=saneful-test npm run migrate
```

And `npm test` should work at this point

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`


# Express Boilerplate!

This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.