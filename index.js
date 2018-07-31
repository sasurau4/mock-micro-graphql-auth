const { get, post, options, router } = require('microrouter');
const { send, json } = require('micro');
const { isUser, createToken, verifyToken } = require('./auth');
const { apolloServer } = require('./apollo-server');

const loginHandler = async (req, res) => {
  const body = await json(req);
  const { email, password } = body;

  // check correct user's email and password set
  if (!isUser({ email, password })) {
    return send(res, 401, 'Incorrect email or password');
  }

  const access_token = createToken({ email, password });
  return send(res, 200, { access_token });
};

const apolloHandler = apolloServer.createHandler();

const graphqlHandler = async (req, res) => {
  const userAgent = req.headers['user-agent'];

  // for debug
  if (/Chrome/.test(userAgent)) {
    return apolloHandler(req, res);
  }

  const { authorization } = req.headers;

  // check authorization format check
  if (authorization === undefined || authorization.split(' ')[0] !== 'Bearer') {
    return send(res, 401, { error: 'Error in authorization format' });
  }

  // check token
  const { error } = await verifyToken(authorization.split(' ')[1]).catch(e => ({
    data: null,
    error: e,
  }));

  if (error) {
    console.log(error);
    return send(res, 401, { error: 'Error access_token is revoked' });
  }

  return apolloHandler(req, res);
};

module.exports = router(
  post('/auth/login', loginHandler),
  options('/graphql', graphqlHandler),
  post('/graphql', graphqlHandler),
  get('/graphql', graphqlHandler)
);
