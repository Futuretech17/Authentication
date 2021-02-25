const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const app = express();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",function(req, res){
  User.findOne({email: req.body.username}, function(err, foundUser){
    if(foundUser){
      if (md5(req.body.password) === foundUser.password){
        res.render("secrets");
      }else{
        res.send("Wrong Password. Please try again");
      }
    }else{
      res.send("You are not yet registered. Please try to register fast.")
    }
  });
});


app.listen(3000, function(){
  console.log("Server successfully started on port 3000");
});
