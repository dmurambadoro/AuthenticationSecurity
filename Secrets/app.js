//jshint esversion:6
require('dotenv').config(); //no need to set a const; just require it, it will be active and running
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

//like a user object in Java
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//const secret = "Thisisourlittlesecret."; //this line in .env file as below
//SECRET=Thisisourlittlesecret.

//userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema)

app.get("/", function(req, res) {
    res.render("home");
})

app.get("/login", function(req, res) {
    res.render("login");
})

app.get("/register", function(req, res) {
    res.render("register");
})

app.post("/register", function (req, res) {
    //create a new User
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    //save new User
    newUser.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
    
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    //look through a collection of users; email is in the database
    User.findOne({email: username}, function(err, foundUser) {
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000, () => {
    console.log("Listening at port 3000.");
})