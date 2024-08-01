const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
  .then(async() => {
    console.log("connected to DB");
    await initDB();
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
      initData.data=initData.data.map((obj)=>({...obj, owner:"66a938738304a6029aaf4b77"}));
      await Listing.insertMany(initData.data);
      console.log("data was initialized");
    } catch (err) {
      console.error("Initialization error:", err);
    }
  };
  

//initDB();