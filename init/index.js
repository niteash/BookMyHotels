const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/bookMyHotels";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error");
  });

async function main() {
  mongoose.connect(MONGO_URL);
}

const initializeDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "683d63aee3e225db9109e3bf",
  }));
  await Listing.insertMany(initdata.data);
  console.log("Data was initialise");
};

initializeDB();
