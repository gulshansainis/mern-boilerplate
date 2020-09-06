const request = require("supertest");
const { mongoose } = require("../../server");
const User = require("../../models/User");

describe("On /api/signup", () => {
  let { server, mongoose } = require("../../server");

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  it("signup should fail if no name", async () => {
    const user = {
      name: "",
      email: "fake@gmail.com",
      password: "123456",
    };
    const res = await request(server).post("/api/signup").send(user);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("error", `Name is required`);
  });

  it("signup should fail if no email", async () => {
    const user = {
      name: "Fake User",
      email: "",
      password: "123456",
    };
    const res = await request(server).post("/api/signup").send(user);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("error", `Valid email is required`);
  });

  it("signup should fail if not a valid email", async () => {
    const user = {
      name: "Fake User",
      email: "fake@gmail",
      password: "123456",
    };
    const res = await request(server).post("/api/signup").send(user);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("error", `Valid email is required`);
  });

  it("signup should fail if no password", async () => {
    const user = {
      name: "Fake User",
      email: "fake@gmail.com",
      password: "",
    };
    const res = await request(server).post("/api/signup").send(user);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty(
      "error",
      `Password must be atleast 6 characters long`
    );
  });

  it("signup should fail if password less than 6 characters", async () => {
    const user = {
      name: "Fake User",
      email: "fake@gmail.com",
      password: "fake",
    };
    const res = await request(server).post("/api/signup").send(user);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty(
      "error",
      `Password must be atleast 6 characters long`
    );
  });

  it("signup should fail if user already exist", async () => {
    const user = {
      name: "Fake Random User",
      email: `${Date.now()}fake@gmail.com`,
      password: "123456",
    };
    // create user
    const newUser = new User(user);
    newUser.save();

    // try to insert same user again
    const res = await request(server).post("/api/signup").send(user);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", `Email already registered`);

    // delete user after test
    await User.findOneAndDelete({ email: user.email });
  });

  it("signup should pass with valid email and password", async () => {
    const user = {
      name: "Fake User",
      email: "fake@gmail.com",
      password: "123456",
    };
    const res = await request(server).post("/api/signup").send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      `Account activation link sent to email ${user.email}.`
    );
  });
});

describe("On /api/account-activation", () => {
  let { server, mongoose } = require("../../server");

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  it("activation should fail if token expires", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3Vsc2hhbiBTYWluaSIsImVtYWlsIjoiZ3Vsc2hhbi5zYWluaUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1NiIsImlhdCI6MTU5OTM1NzQwMCwiZXhwIjoxNTk5MzU4MDAwfQ.mkWwQSiiKhpvH2-GsDiCPQ7fnkiNEZ5PInv2WVaxVWI";

    const res = await request(server)
      .post("/api/account-activation")
      .send({ token });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "error",
      `Activation link expired. Signup again`
    );
  });

  // TODO - add account already exist test case
});

describe("On /api/signin", () => {
  let { server, mongoose } = require("../../server");

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  it("signin should fail if no email", async () => {
    const user = {
      email: "",
      password: "123456",
    };
    const res = await request(server).post("/api/signin").send(user);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("error", `Email is required`);
  });

  it("signin should fail if not a valid email", async () => {
    const user = {
      email: "fake@gmail",
      password: "123456",
    };
    const res = await request(server).post("/api/signin").send(user);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("error", `Valid email is required`);
  });

  it("signin should fail if no password", async () => {
    const user = {
      email: "fake@gmail.com",
      password: "",
    };
    const res = await request(server).post("/api/signin").send(user);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty(
      "error",
      `Password must be atleast 6 characters long`
    );
  });

  it.skip("signin should fail if user does not exist", async () => {
    const user = {
      email: `fake@gmail.com`,
      password: "123456",
    };

    const res = await request(server).post("/api/signin").send(user);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      `User does not exist. Please signup`
    );
  });

  it.skip("signin should fail if user does not exist", async () => {
    const user = {
      name: "Fake Random User",
      email: `fake@gmail.com`,
      password: "123456",
    };

    const res = await request(server).post("/api/signin").send(user);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      `User does not exist. Please signup`
    );
  });
});
