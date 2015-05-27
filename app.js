// app.js Client Side

var express = require('express'),
    bodyParser = require('body-parser'),
    session = require("express-session"),
    path = require("path"),
    db = require("./models"),
    app = express();

// Middleware
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({ // pass in object
  secret: 'super secret', // obscures session cookies
  resave: false,  // don't retry saving session objects
  saveUninitialized: true // save a session for someone who hasn't created one
}));

var views = path.join(process.cwd(), "views");

// Create some special login functionality to save a user's
// data in the session.  This is our own middleware, we need to 
// call next()
app.use("/", function (req, res, next) {

  // log in a user by saving their userId
  req.login = function (user) {
    // user ~{email: "jane@user.com", _id: ASDF}
    req.session.userId = user._id; // _id is from Mongo
  };

  // fetches the user associated with the
  // current session
  req.currentUser = function (cb) {
     db.User.
      findOne({ // notice the findOne again!!
          _id: req.session.userId
      }, // once done, run the call back
      function (err, user) {
        req.user = user;
        cb(null, user);
      })
  };

  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  }

  next(); 
});

// Routes

// Present user with index.html
app.get("/", function(req, res) {
  console.log("/", "get");
  res.sendFile(path.join(views, "index.html"));
});

// Present user with sign up page
app.get("/signup", function (req, res) {
  console.log("get", "/signup");
  res.sendFile(path.join(views, "signup.html"));
});

// todo: check password for length, etc.
var isValidPassword = function (password) {
  return (password.length > 8);
}

var isEmailUnique = function (email) {
  console.log("isEmailUnique()", email);
  db.User
    .findOne({ email: email},
    function(err, user) {
      return (user === null);
    });
  //return true;
};
                 

// todo: check if the user already exists.  If
// so then log them in and redirect them to the
// profiles page

// Where users will POST data to create an account
app.post("/users", function(req, res) {
  // test
  console.log("post", "/users", req.body.user);
  //res.send(req.body.user);

  // grab the user from the params
  var newUser = req.body.user;
  //if (true) {
  if (isValidPassword(newUser.password) &&
      isEmailUnique(newUser.email)) {
  // create the new user with email & password
    db.User
      .createSecure(newUser.email, newUser.password,
                    function(err, user) {
                      //res.send("Signed Up!");
                      req.login(user);  // call our middleware function
                      res.redirect("/profile");
                    });
  } else {
    res.send("Somethings wrong with your user name or password\n" +
             "Hit the back button and start over");
    //setTimeout(res.redirect("/signup"), 1000);
  }
});

// Present user with login page
app.get("/login", function(req, res) {
  res.sendFile(path.join(views, "login.html"));
});

// we will type in the user password and email into
// a form then post it to this route to login
app.post("/login", function(req, res) {
  // test
  console.log("/login", "post", req.body.user);
  //res.send(req.body.user);

  var user = req.body.user;
  
  db.User
    .authenticate(user.email, user.password,
                  function (err, user) {
                    //console.log("authenticate(), Logging in");
                    req.login(user);  // call our middleware function
                    res.redirect("/profile");
                  });
});

// Create route to get user profile from server
app.get("/profile", function(req, res) {
  req.currentUser(function (err, user) {
    console.log("get", "/profile", user);
    res.send("Welcome " + user.email);
  })
});

app.get("/logout", function(req, res) {
  console.log("get", "logout");
  req.logout();
  res.send("You have successfully logged out");
});

// List all the accounts for debugging
app.get("/accounts", function(req, res) {
  db.User
    .find({}, function(err, accounts) {
      res.send(accounts);
    });
});


app.listen(3000, function () {
  console.log("SERVER RUNNING");
});
