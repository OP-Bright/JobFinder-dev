const mongoose = require("mongoose");

main().then(() => {
  console.info("Connected to the database");
}).catch((err) => console.log("Failed to connect to database", err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/jobfinder");
}

// Interest
const interestSchema = new mongoose.Schema({
  name: String,
});

const Interest = mongoose.model("Interest", interestSchema);

// Skill
const skillSchema = new mongoose.Schema({
  name: String,
});

const Skill = mongoose.model("Skill", skillSchema);

// ExperienceLevel
const experienceLevelSchema = new mongoose.Schema({
  name: String,
});

const ExperienceLevel = mongoose.model(
  "ExperienceLevel",
  experienceLevelSchema
);

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
  Interest,
  Skill,
  ExperienceLevel,
  User,
  ReportedUrl,
};
