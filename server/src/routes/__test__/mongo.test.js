const request = require("supertest");
const { app } = require("../../app");

it("test if creating works", async () => {
  const post = await request(app)
    .post("/api/createPrompt")
    .send({
      hash: "test",
      prompt: "test prompt",
      model: "gpt-4",
      parameteres: {},
      response: {},
    })
    .expect(200);

  const get = await request(app)
    .post("/api/getPrompt")
    .send({
      hash: "test",
    })
    .expect(200);
});

it("test no prompt found", async () => {
  return await request(app)
    .post("/api/getPrompt")
    .send({
      hash: "not defined",
    })
    .expect(500);
});

it("test if update works", async () => {
  const post = await request(app)
    .post("/api/createPrompt")
    .send({
      hash: "test",
      prompt: "test prompt",
      model: "gpt-4",
      parameteres: { hi: "parameter" },
      response: { hello: "response" },
    })
    .expect(200);

  const update = await request(app).put("/api/updatePrompt").send({
    hash: "test",
    prompt: "hello hello",
    model: "gpt-6",
  });

  console.log(update.body);
});
