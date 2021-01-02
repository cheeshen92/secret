require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

// Enable body parser
app.use(bodyParser.urlencoded({
  extended: true
}))

// ENable EJS template
app.set('view engine', 'ejs');

// setup mongDB database
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});

secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);

// Enable files used in html/ejs to be rendered to server
app.use(express.static("public"));

app.get("/",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(!err){
      console.log("New user added.");
      res.render("secrets");
    } else {
      console.log("Registration unsuccessful.");
    }
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err, foundUser){
    if (foundUser && foundUser.password===password) {
      console.log("User log in successfully.");
      res.render("secrets");
    } else {
      console.log("Invalid username or password.");
    }
  })

})

// Setup Server
app.listen(3000, function() {
  console.log("Server is online at port 3000");
})
