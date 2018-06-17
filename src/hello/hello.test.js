const test = require("ava");
const { join } = require("path");
const { start, stop, $get } = require("mono-test-utils");

let monoContext;

test.before("Start API", async () => {
  const basePath = join(__dirname, '../..')
  monoContext = await start(basePath);
});

test("GET /hello => 200", async t => {
  const { statusCode, body } = await $get("/hello");
  t.is(statusCode, 200);
  t.deepEqual(body, { hello: "world" });
});

test.after("Stop server", async () => {
  await stop(monoContext.server);
});