const request = require("supertest");
let { server, mongoose, stopChatServer } = require("../../server");
const Org = require("../../models/Org");
const User = require("../../models/User");

afterAll(async () => {
  await stopChatServer();
  await server.close();
  await mongoose.connection.close();
});

describe("On /api/org/signup", () => {
  it("org signup should fail if org_name is missing", async () => {
    const org = {
      org_name: "",
      org_website: "https://example.com",
      org_email_domain: "example.com",
      primary_contact_name: "Test User",
      primary_contact_email: "test.user@example.com",
    };

    const res = await request(server).post("/api/org/signup").send(org);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("error", `Organisation name is required`);
  });

  it("org signup should fail if org_website is missing", async () => {
    const org = {
      org_name: "VDX TV",
      org_website: "",
      org_email_domain: "example.com",
      primary_contact_name: "Test User",
      primary_contact_email: "test.user@example.com",
    };

    const res = await request(server).post("/api/org/signup").send(org);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty(
      "error",
      `Organisation website is required`
    );
  });

  it("org signup should fail if org_email_domain is missing", async () => {
    const org = {
      org_name: "VDX TV",
      org_website: "https://example.com",
      org_email_domain: "",
      primary_contact_name: "Test User",
      primary_contact_email: "test.user@example.com",
    };

    const res = await request(server).post("/api/org/signup").send(org);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty(
      "error",
      `Valid Organisation email domain is required`
    );
  });

  it("org signup should fail if primary_contact_name is missing", async () => {
    const org = {
      org_name: "VDX TV",
      org_website: "https://example.com",
      org_email_domain: "example.com",
      primary_contact_name: "",
      primary_contact_email: "test.user@example.com",
    };

    const res = await request(server).post("/api/org/signup").send(org);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty(
      "error",
      `Primary contact name is required`
    );
  });

  it("org signup should fail if primary_contact_email is missing", async () => {
    const org = {
      org_name: "VDX TV",
      org_website: "https://example.com",
      org_email_domain: "example.com",
      primary_contact_name: "Test User",
      primary_contact_email: "",
    };

    const res = await request(server).post("/api/org/signup").send(org);
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty(
      "error",
      `Valid email required of primary contact`
    );
  });

  // skip to avoid send grid email blocking
  it.skip("org signup should pass if valid values", async () => {
    const org = {
      org_name: "Fake Company",
      org_website: "https://fake.company",
      org_email_domain: "fake.tv",
      primary_contact_name: "Fake User",
      primary_contact_email: "fakeuser@fake.tv",
    };
    try {
      const res = await request(server).post("/api/org/signup").send(org);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty(
        "message",
        `Organisation activation link sent to email ${org.primary_contact_email}.`
      );
    } finally {
      await Org.findOneAndDelete({ org_email_domain: org.org_email_domain });
      await User.findOneAndDelete({ email: org.primary_contact_email });
    }
  });

  it("org signup should fail if organisation already exist", async () => {
    const org = {
      org_name: "Fake Company",
      org_website: "https://fake.company",
      org_email_domain: "fake.tv",
      primary_contact_name: "Fake User",
      primary_contact_email: "fakeuser@fake.tv",
    };
    try {
      // create new Org
      await new Org(org).save();

      const res = await request(server).post("/api/org/signup").send(org);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty(
        "error",
        `Organisation already registered`
      );
    } finally {
      await Org.findOneAndDelete({ org_email_domain: org.org_email_domain });
      await User.findOneAndDelete({ email: org.primary_contact_email });
    }
  });
});
