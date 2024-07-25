const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");


app.use(methodOverride('_method'));
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect('mongodb://localhost:27017/wanderlust')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

/*async function main() {
    await mongoose.connect(MONGO_URL);
  }*/

 app.set("view engine", "ejs");
 app.set("views", path.join(__dirname, "views"));

  
/*app.get("/",(req,res)=>{
    res.send("hi i am rout");
});*/


//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  });
  

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  //Show Route
  app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  });
  
  //Create Route
  app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  });
  
  //Edit Route
  app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  });
  
  //Update Route
  app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  });
  
  //Delete Route
  app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
   // console.log(deletedListing);
    res.redirect("/listings");
});





app.listen(8080, () => {
    console.log("server is listening to port 8080");
  })