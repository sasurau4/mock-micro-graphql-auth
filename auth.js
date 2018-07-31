const fs = require('fs');
const jwt = require('jsonwebtoken');

const SECRET_WORD = 'I am secret word';
const expiresIn = '1h';

const createToken = payload => jwt.sign(payload, SECRET_WORD, { expiresIn });

const verifyToken = token =>
  new Promise((resolve, reject) =>
    jwt.verify(
      token,
      SECRET_WORD,
      (err, decode) => (decode !== undefined ? resolve(decode) : reject(err))
    )
  );

const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'));

const isUser = ({ email, password }) =>
  userdb.users.findIndex(
    user => user.email === email && user.password === password
  ) !== -1;

module.exports = {
  createToken,
  verifyToken,
  isUser,
};
