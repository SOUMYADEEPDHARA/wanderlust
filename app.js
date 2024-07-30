
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsyc.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js");
const { reviewSchema } = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy= require("passport-local")
const User = require("./models/user.js");




const listingsRouter= require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");


app.use(methodOverride('_method'));
const bodyParser = require('body-parser');
const { render } = require("ejs");
const { connect } = require("http2");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main().then(() => {
  console.log('Connected to MongoDB');
})
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const sessionOptions={
  secret: 'Mysecretcpde',
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //milisec*sec*min*hour*day[after 7 days expires]
    maxAge:1000 * 60 * 60 * 24 * 7

  }
}


app.get("/", (req, res) => {
  res.send("hi i am rout");
});



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next) =>{
  res.locals.success= req.flash("success");
  res.locals.error= req.flash("error");
  next();
});

/*app.get("/demouser",async(req,res)=>{
  let fakeUser= new User({
      email:"student@gmail.com",
      username:"student",
  });
 let registeredUser= await User.register(fakeUser,"hello");
 res.send(registeredUser);
});*/

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});
//error handeling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  //res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});