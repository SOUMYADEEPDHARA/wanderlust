const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

main()
  .then(() => {
    console.log("connected to DB");
   // await initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
const initDB = async () => {
    try {
      await Listing.deleteMany({});
      await Listing.insertMany(initData.data);
      console.log("data was initialized");
    } catch (err) {
      console.error("Initialization error:", err);
    }
  };
  

initDB();