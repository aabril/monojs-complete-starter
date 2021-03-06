const test = require("ava");
const _ = require('lodash');
const { join } = require("path");
const { start, stop, $get, $post } = require("mono-test-utils");

let jwtToken;
let monoContext;

test.before("Start API", async () => {
  const basePath = join(__dirname, '../..')
  monoContext = await start(basePath);
});

test("POST /session => 400 with error", async t => {
  const newSession = { "userId": 1, "username": "mono-js" }
  const { statusCode, body } = await $post('/session', { body: newSession } )
  t.is(statusCode, 400)
  t.truthy(_.isObject(body))
  t.is(body.code, 'validation-error')
  jwtToken = body.token
})

test("POST /session => 200 with token", async t => {
  const newSession = {
    "username": "mono-js",
    "email": "something@email.com",
    "password": "dummy-password"
  }

  const { statusCode, body } = await $post('/session', { body: newSession } )

  t.is(statusCode, 200)
  t.truthy(_.isObject(body))
  t.truthy(_.isString(body.token))

  jwtToken = body.token
})

test("GET /session => 200 with userId and username", async t => {
  const headers = { "Authorization": `Bearer ${jwtToken}` }
  const { statusCode, body } = await $get('/session', { headers })

  t.is(statusCode, 200)
  t.truthy(_.isObject(body))
  t.truthy(_.isInteger(body.userId))
});

test.after("Stop server", async () => {
  await stop(monoContext.server);
});
