const express = require("express");
const AuthService = require("./auth-service");

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter
.post("/", jsonBodyParser, (req, res, next) => {
  const { user_email, user_password } = req.body;
  const loginUser = { user_email, user_password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  AuthService.getUserWithUserEmail(req.app.get("db"), loginUser.user_email)
    .then((dbUser) => {
      if (!dbUser)
        return res.status(400).json({
          error: "Incorrect email or password",
        });
      return AuthService.comparePasswords(
        loginUser.user_password,
        dbUser.user_password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: "Incorrect user_email or password",
          });

        const sub = dbUser.user_email;
        const payload = { user_id: dbUser.user_id, user_name: dbUser.user_name};
        res.send({
          authToken: AuthService.createJwt(sub, payload),
          user_id: payload.user_id,
          user_name: payload.user_name,
        });
      });
    })
    .catch(next);
});

module.exports = authRouter;
