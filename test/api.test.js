const test = require("ava");
const _ = require('lodash');

const { join } = require("path");
const { start, stop, $get, $post, $put, $del } = require("mono-test-utils");

let monoContext;
let jwtToken;
const context = {};

test.before("Start API", async () => {
  monoContext = await start(join(__dirname, ".."));
});

test("GET /hello => 200", async t => {
  const { statusCode, body } = await $get("/hello");
  t.is(statusCode, 200);
  t.deepEqual(body, { hello: "world" });
});

test("POST /todos => 400 with no body", async t => {
  const { statusCode, body } = await $post("/todos", { body: {} });
  t.is(statusCode, 400);
  t.is(body.code, "validation-error");
});

test("POST /todos => 400 with bad params", async t => {
  const title = { title: "" };
  const { statusCode, body } = await $post("/todos", { body: title });
  t.is(statusCode, 400);
  t.is(body.code, "validation-error");
  t.is(body.context[0].field[0], "title");
});

test("POST /todos => 200 with good params", async t => {
  const todo = { title: "First todo" };
  const { statusCode, body } = await $post("/todos", { body: todo });
  t.is(statusCode, 200);
  t.is(body.title, todo.title);
  t.truthy(body.createdAt);
  t.truthy(body.updatedAt);
  t.truthy(body._id);
  context.todo = body;
});

test("GET /todos => 200 with todos list", async t => {
  const { statusCode, body } = await $get("/todos");
  t.is(statusCode, 200);
  t.is(body.length, 1);
  t.deepEqual(body[0], context.todo);
});

test("GET /todos?limit=1&offset=1 => 200 with empty array", async t => {
  const { statusCode, body } = await $get("/todos?limit=1&offset=1");
  t.is(statusCode, 200);
  t.is(body.length, 0);
});

test("GET /todos/:id => 400 with bad param", async t => {
  const { statusCode, body } = await $get("/todos/bad");
  t.is(statusCode, 400);
  t.is(body.code, "validation-error");
});

test("GET /todos/:id => 404 with unknown ID", async t => {
  const { statusCode, body } = await $get("/todos/012345678901234567890123");
  t.is(statusCode, 404);
  t.is(body.code, "todo-not-found");
});

test("GET /todos/:id => 200 with todo", async t => {
  const { statusCode, body } = await $get(`/todos/${context.todo._id}`);
  t.is(statusCode, 200);
  t.deepEqual(body, context.todo);
});

test("PUT /todos/:id => 400 with bad param", async t => {
  const { statusCode, body } = await $put(`/todos/${context.todo._id}`);
  t.is(statusCode, 400);
  t.is(body.code, "validation-error");
  t.is(body.context[0].field[0], "title");
});

test("PUT /todos/:id => 404 with unknown ID", async t => {
  const newTodo = { title: "Updated todo" };
  const { statusCode, body } = await $put("/todos/012345678901234567890123", { body: newTodo });
  t.is(statusCode, 404);
  t.is(body.code, "todo-not-found");
});

test("PUT /todos/:id => 200 with todo", async t => {
  const newTodo = { title: "Updated todo" };
  const { statusCode, body } = await $put(`/todos/${context.todo._id}`, { body: newTodo });
  t.is(statusCode, 200);
  t.not(body.title, context.todo.title);
  t.is(body._id, context.todo._id);
  t.true(+new Date(body.updatedAt) > +new Date(context.todo.updatedAt));
  context.todo = body;
});

test("DELETE /todos/:id => 400 with bad ID", async t => {
  const { statusCode, body } = await $del("/todos/bad");
  t.is(statusCode, 400);
  t.is(body.code, "validation-error");
  t.is(body.context[0].field[0], "id");
});

test("DELETE /todos/:id => 404 with unknown ID", async t => {
  const { statusCode, body } = await $del("/todos/012345678901234567890123");
  t.is(statusCode, 404);
  t.is(body.code, "todo-not-found");
});

test("DELETE /todos/:id => 200 with todo", async t => {
  const { statusCode } = await $del(`/todos/${context.todo._id}`);
  t.is(statusCode, 200);
});

test("POST /session => 200 with token", async t => {
  const newSession = { "userId": 1, "username": "mono-js" }
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
  t.truthy(_.isString(body.username))
});

test.after("Stop server", async () => {
  await stop(monoContext.server);
});
