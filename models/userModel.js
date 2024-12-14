const db = require("../config/db");

const createUser = async (userData) => {
  const { name, email, mobile, address, password } = userData;
  const query =
    "INSERT INTO users (name, email, mobile, address, password) VALUES (?, ?, ?, ?, ?)";
  return db.execute(query, [name, email, mobile, address, password]);
};

const findUserByMobile = async (mobile) => {
  const query = "SELECT * FROM users WHERE mobile = ?";
  const [rows] = await db.execute(query, [mobile]);
  return rows[0];
};

// Function to update suggestion for the user
const updateSuggestionForUser = async (mobile, suggestion) => {
  const query = "UPDATE users SET suggestion = ? WHERE mobile = ?";
  return db.execute(query, [suggestion, mobile]);
};

module.exports = {
  createUser,
  findUserByMobile,
  updateSuggestionForUser,
};
