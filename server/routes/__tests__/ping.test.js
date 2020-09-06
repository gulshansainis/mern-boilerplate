const request = require("supertest");

describe("On startup /api/ping", () => {
  let { server, mongoose } = require("../../server");

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  it("should respond with status 200", async () => {
    const res = await request(server).get("/api/ping").send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Server is up!!");
  });
});
