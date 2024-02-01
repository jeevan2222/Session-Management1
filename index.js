const express = require("express");
const session = require("express-session");
const sequelize = require("./db");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const port = 1234;
const User = require("./user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const myStore = new SequelizeStore({
  db: sequelize,
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: myStore,
    cookie: { maxAge: 60000 } 
  })
);

const updateSessionExpiration = (req, res, next) => {

  if (req.session.Auth) {
    req.session.cookie.expires = new Date(Date.now() + 60000); // Update expiration time to 1 minute from now
  }
  next();
};

app.use(updateSessionExpiration);

const Authentication = (req, res, next) => {
  if (req.session.Auth) {
    next();
  } else {
    res.redirect("/");
  }
};

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });
  if (user) {
    req.session.Auth = true;
    res.redirect("/dashboard");
  } else {
    res.send({ status: 404, message: "User Not Found" });
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/User-register", async (req, res) => {
  const { name, email, password } = req.body;

  const jane = await User.create({
    name: name,
    email: email,
    password: password,
  });

  if (jane) res.render("login");
});

app.get("/dashboard", Authentication, (req, res) => {
  res.render("dashboard");
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.use(function (req, res, next) {
  res.status(404).send({
    status: 404,
    error: true,
    message: 'No Such URL',
    data: null,
  });
});

app.listen(port, () => {
  console.log("server running ", port);
});
