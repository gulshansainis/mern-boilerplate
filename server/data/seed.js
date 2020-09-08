/**
 * Populate database
 * Database is populated first time with new organisation and super user (this step only run once).
 * If records exist in database nothing is inserted in database.
 */
const Org = require("../models/Org");
const User = require("../models/User");

// check if first run
const isFirstRun = async () => {
  const results = await Org.find({});
  return results.length === 0;
};

const createOrganisation = async () => {
  const org = {
    status: "active",
    org_name: "Chatters.co",
    org_website: "https://www.chatters.co",
    org_email_domain: "chatters.co",
    primary_contact_name: "Super Admin",
    primary_contact_email: "superadmin@chatter.co",
  };
  try {
    const newOrg = new Org(org);
    newOrg.save();
  } catch (error) {
    console.log(error);
    throw Error("[Populating DB] - Error creating organisation");
  }
};

const createSuperUser = async () => {
  const user = {
    role: "superadmin",
    status: "active",
    name: "Super Admin",
    email: "superadmin@chatter.co",
    org_email: "superadmin@chatter.co",
    salt: "327650584085",
    hashed_password: "2b37b93d9511f6b7e57f73b13565f7600186ff30",
    org_email_domain: "chatter.co",
    resetPasswordLink: "",
  };
  try {
    const newUser = new User(user);
    newUser.save();
  } catch (error) {
    throw Error("[Populating DB] - Error creating super user");
  }
};

const populateDB = async () => {
  const freshDB = await isFirstRun();
  if (freshDB) {
    console.log("Populating Database");
    // create organisation
    await createOrganisation();
    // create super user
    await createSuperUser();
  } else {
    console.log("Skipping populating database as record already present");
  }
};

module.exports = {
  populateDB,
};
