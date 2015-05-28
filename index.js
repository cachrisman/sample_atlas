var express = require("express"),
    bodyParser = require("body-parser"),
    session = require("express-session"),
    db = require("./models"),
    path = require("path");

app = express();
app.use(bodyParser.urlencoded({extended: true }));
app.use(session({
  secret: "SUPER STUFF",
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

app.post("/users", function(req, res) {
  var newUser = req.body.user;
  console.log("post()", "/users", newUser);
  db.User
    .createSecure(newUser, function (err, user) {
      if (user) {
        res.send(user);
      } else {
        //console.log("createSecure() failed");
        res.redirect("/register");
      }
    });
});

app.get("/login", function(req, res) {
  console.log("get()", "/login");
  var loginPath = path.join(views, "login.html");
  res.sendFile(loginPath);
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
                      res.redirect("/login");
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
  console.log("demoPath: ", demoPath);
  res.sendFile(demoPath);
/*
  req.currentUser(function (err, user) {
    if (!err) {
      res.send(user.email);
    } else {
      res.redirect("/login");
    }
  });
*/
});


app.get("/logout", function(req, res) {
  req.logout();
  req.redirect("/");
});


// List all the accounts for debugging
app.get("/accounts", function(req, res) {
  db.User
    .find({}, function(err, accounts) {
      res.send(accounts);
    });
});


app.listen(3000, function () {
  console.log("Running!");
})
