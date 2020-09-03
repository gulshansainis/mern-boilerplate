const mongoose = require("mongoose");

// Organisation schema
const OrgSchema = new mongoose.Schema(
  {
    org_name: {
      type: String,
      trim: true,
      required: true,
    },
    org_website: {
      type: String,
      trim: true,
      required: true,
    },
    org_email_domain: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    primary_contact_name: {
      type: String,
      trim: true,
      required: true,
    },
    primary_contact_email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    status: {
      type: String,
      default: "disabled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Org", OrgSchema);
