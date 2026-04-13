const authService = require('../services/authService');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const { username, password, name, email } = req.body;
    const result = await authService.register({ username, password, name, email });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { login, register };
