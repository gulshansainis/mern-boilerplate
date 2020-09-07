const request = require("supertest");
const User = require("../../models/User");

let { server, mongoose, stopChatServer } = require("../../server");

afterAll(async () => {
  await stopChatServer();
  await server.close();
  await mongoose.connection.close();
});

describe("On /api/signup", () => {
  it("signup should fail if no name", async () => {
    const user = {
      name: "",
      email: `${Date.now()}fake@gmail.com`,
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
      email: `fake@gmail`,
      password: "123456",
    };
    const res = await request(server).post("/api/signup").send(user);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("error", `Valid email is required`);
  });

  it("signup should fail if no password", async () => {
    const user = {
      name: "Fake User",
      email: `${Date.now()}fake@gmail.com`,
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
      email: `${Date.now()}fake@gmail.com`,
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

    try {
      // create user
      const newUser = new User(user);
      newUser.save();
      // try to insert same user again
      const res = await request(server).post("/api/signup").send(user);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", `Email already registered`);
    } finally {
      // delete user after test
      await User.findOneAndDelete({ email: user.email });
    }
  });

  // skip below to avoid sendgrid blocking account
  it.skip("signup should pass with valid email and password", async () => {
    const user = {
      name: "Fake User",
      email: `${Date.now()}fake@gmail.com`,
      password: "123456",
    };

    try {
      const res = await request(server).post("/api/signup").send(user);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty(
        "message",
        `Account activation link sent to email ${user.email}.`
      );
    } finally {
      // delete user after test
      await User.findOneAndDelete({ email: user.email });
    }
  });
});

describe("On /api/account-activation", () => {
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
      email: `fake@gmail`,
      password: "123456",
    };
    const res = await request(server).post("/api/signin").send(user);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("error", `Valid email is required`);
  });

  it("signin should fail if no password", async () => {
    const user = {
      email: `${Date.now()}fake@gmail.com`,
      password: "",
    };
    const res = await request(server).post("/api/signin").send(user);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty(
      "error",
      `Password must be atleast 6 characters long`
    );
  });

  it("signin should fail if password length lessa than 6 characters", async () => {
    const user = {
      email: `${Date.now()}fake@gmail.com`,
      password: "wew",
    };
    const res = await request(server).post("/api/signin").send(user);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty(
      "error",
      `Password must be atleast 6 characters long`
    );
  });

  it("signin should fail if user does not exist", async () => {
    const user = {
      email: `${Date.now()}fake@gmail.com`,
      password: "123456",
    };

    const res = await request(server)
      .post("/api/signin")
      .send({ email: user.email, password: user.password });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      `User does not exist. Please signup`
    );
  });

  it("signin should fail if password do not match", async () => {
    const user = {
      name: "Fake Random User",
      email: `${Date.now()}fake@gmail.com`,
      password: "123456",
    };

    try {
      // create user
      const newUser = new User(user);
      await newUser.save();

      const res = await request(server)
        .post("/api/signin")
        .send({ email: user.email, password: "otherpassword" });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty(
        "error",
        `Email and Password do not match`
      );
    } finally {
      // delete user after test
      await User.findOneAndDelete({ email: user.email });
    }
  });

  // skip below to avoid sendgrid blocking account
  it.skip("signin should pass if valid user", async () => {
    const user = {
      name: "Fake Random User",
      email: `${Date.now()}fake@gmail.com`,
      password: "123456",
    };

    try {
      // create user
      const newUser = new User(user);
      await newUser.save();

      const res = await request(server)
        .post("/api/signin")
        .send({ email: user.email, password: user.password });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
    } finally {
      // delete user after test
      await User.findOneAndDelete({ email: user.email });
    }
  });
});

describe("On /api/forgot-password", () => {
  it("server should throw error if no email", async () => {
    const res = await request(server)
      .put("/api/forgot-password")
      .send({ email: "" });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("error", `Email is required`);
  });

  it("server should throw error if not a valid email", async () => {
    const user = {
      email: `${Date.now()}fake@gmail.com`,
    };
    const res = await request(server)
      .put("/api/forgot-password")
      .send({ email: user.email });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      `User does not exist. Please signup`
    );
  });

  it.skip("server should responnd with success if a valid email", async () => {
    const user = {
      name: "Fake Random User",
      email: `${Date.now()}fake@gmail.com`,
      password: "123456",
    };

    try {
      // create user
      const newUser = new User(user);
      await newUser.save();

      const res = await request(server)
        .put("/api/forgot-password")
        .send({ email: user.email });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty(
        "message",
        `Reset password link sent to email ${user.email}.`
      );
    } finally {
      // delete user after test
      await User.findOneAndDelete({ email: user.email });
    }
  });
});

describe("On /api/reset-password", () => {
  it("server should throw error if no resetPasswordToken", async () => {
    const res = await request(server)
      .put("/api/reset-password")
      .send({ resetPasswordLink: "", newPassword: "" });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("error", `Token missing in request`);
  });

  it("server should throw error if no password", async () => {
    const res = await request(server)
      .put("/api/reset-password")
      .send({ resetPasswordLink: "faketoken", newPassword: "" });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty(
      "error",
      `New password must be atleast 6 characters long`
    );
  });

  it("server should throw error if token expired", async () => {
    const res = await request(server)
      .put("/api/reset-password")
      .send({ resetPasswordLink: "faketoken", newPassword: "fakepassword" });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", `Expired link, please try again`);
  });
});
