const request = require("supertest");
let { server, mongoose, stopChatServer } = require("../../server");

afterAll(async () => {
  await stopChatServer();
  await server.close();
  await mongoose.connection.close();
});

describe("On startup /api/ping", () => {
  it("should respond with status 200", async () => {
    const res = await request(server).get("/api/ping").send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Server is up!!");
  });
});
