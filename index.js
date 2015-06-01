var express = require("express"),
    bodyParser = require("body-parser"),
    session = require("express-session"),
    MongoStore = require('connect-mongo')(session),
    db = require("./models"),
    path = require("path");

app = express();

// load environment variables
require('dotenv').load();

app.use(bodyParser.urlencoded({extended: true }));
app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({mongooseConnection:db.mongoose.connection}),
  resave: false,
  saveUnitialized: true
}));

app.use(express.static("public"));
app.use(express.static("lib"));
app.use(express.static("demo"));

var loginHelpers = function(req, res, next) {

  req.login = function (user) {
    req.session.userId = user._id;
    req.user = user;
    return user;
  };

  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };

  req.currentUser = function (cb) {
    var userId = req.session.userId;
    db.User
      .findOne({
        _id: userId
        }, cb);
  };

  next();

};

app.use(loginHelpers);


function validateEmail(email) {
  // http://stackoverflow.com/a/46181/11236
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validatePassword(password, confirmation) {
  return (password.length >= 6 && confirmation.length >= 6)
}


var views = path.join(process.cwd(), "views");
console.log("views: ", views);

app.get("/", function (req, res) {
  var homePath = path.join(views, "home.html");
  console.log("homePath: ", homePath);
  res.sendFile(homePath);
});

app.get("/register", function(req, res) {
  console.log("get()", "/register");
  var signupPath = path.join(views, "register.html");
  res.sendFile(signupPath);
});

app.get("/register_error", function(req, res) {
  console.log("get()", "/register_error");
  var errorPath = path.join(views, "register_error.html");
   res.sendFile(errorPath);
});

app.post("/users", function(req, res) {
  var newUser = req.body.user;
  console.log("post()", "/users", newUser);

  if (validateEmail(newUser.email) &&
      validatePassword(newUser.password, newUser.password_confirmation)) {
    db.User
      .createSecure(newUser, function (err, user) {
        if (user) {
          //res.send(user);
          res.redirect("/demo");
        } else {
          console.log("createSecure() failed");
          res.redirect("/register_error");
        }
      });
  } else {
    console.log("validateEmail() or validatePassword() failed");
    res.redirect("/register_error");
  }

});

app.get("/login", function(req, res) {
  console.log("get()", "/login");
  var loginPath = path.join(views, "home.html");
  res.sendFile(loginPath);
});

app.get("/login_error", function(req, res) {
  console.log("get()", "/login_error");
  var errorPath = path.join(views, "login_error.html");
   res.sendFile(errorPath);
});

app.post("/login", function(req, res) {
  var user = req.body.user;
  console.log("post()", "/login", user);

  db.User
    .authenticate(user,
                  function (err, user) {
                    if (!err) {
                      req.login(user);
                      res.redirect("/demo");
                    } else {
                      res.redirect("/login_error");
                      //res.redirect("/");
                    }
                  })
});

app.get("/profile", function(req, res) {
  req.currentUser(function (err, user) {
    if (!err) {
      res.send(user.email);
    } else {
      res.redirect("/login");
    }
  });
});

app.get("/demo", function(req, res) {
  var demoPath = path.join(views, "demo.html");
  console.log("get()", "/demo");

  req.currentUser(function (err, user) {
    if (!err) {
      res.sendFile(demoPath);
      // res.send(user.email);
    } else {
      res.redirect("/login");
    }
  });

});


app.get("/logout", function(req, res) {
  req.logout();
  console.log("get()", "/logout");
  var loginPath = path.join(views, "home.html");
  res.sendFile(loginPath);
});

app.post("/logout", function(req, res) {
  console.log("post()", "/logout");
  res.redirect("/logout");
});



// List all the accounts for debugging
app.get("/accounts", function(req, res) {
  db.User
    .find({}, function(err, accounts) {
      res.send(accounts);
    });
});


app.listen(process.env.PORT || 3000, function () {
  console.log("Running on 3000!");
})
