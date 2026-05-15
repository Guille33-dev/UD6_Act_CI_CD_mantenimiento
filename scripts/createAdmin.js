require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function main() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ud5_biblioteca";
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin1234";

  await mongoose.connect(mongoUri);

  const existing = await User.findOne({ username });
  if (existing) {
    console.log("El usuario admin ya existe.");
    await mongoose.disconnect();
    return;
  }

  const user = new User({ username, password, roles: ["admin"] });
  await user.save();

  console.log(`Usuario admin creado: ${username}`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Error al crear el admin:", error.message);
  process.exit(1);
});
