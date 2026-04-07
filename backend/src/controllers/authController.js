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

module.exports = { login };
