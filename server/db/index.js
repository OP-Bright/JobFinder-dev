const mongoose = require("mongoose");

main().then(() => {
  console.info("Connected to the database");
}).catch((err) => console.log("Failed to connect to database", err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/jobfinder");
}

// Preference
const preferenceSchema = new mongoose.Schema({
  name: String,
});

const Preference = mongoose.model("Preference", preferenceSchema);

// Suggested Preference (by user)
const suggestedPreferenceSchema = new mongoose.Schema({
  name: String,
})

const SuggestedPreference = mongoose.model("SuggestedPreference", suggestedPreferenceSchema)

// User
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  jobs: [],
  preferences: [],
});

const User = mongoose.model("User", userSchema);

// ReportedUrl
const reportedUrlSchema = new mongoose.Schema({
  url: String,
  usersReported: [],
});

const ReportedUrl = mongoose.model("ReportedUrl", reportedUrlSchema);

module.exports = {
  Preference,
  SuggestedPreference,
  User,
  ReportedUrl,
};
