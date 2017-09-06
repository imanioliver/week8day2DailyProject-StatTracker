const express = require("express");
const mustacheExpress = require("mustache-express");
const path = require("path");
const routes = require("./routes/index");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const flash = require('express-flash-messages');
const model = require("./models/index");
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const app = express();


app.use(express.static(path.join(__dirname, "public")));

app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");
app.set("layout", "layout");

app.use(morgan("dev"));


const users = {
  'imani': 'password'
};

passport.use(new BasicStrategy(
  function(username, password, done) {
      const userPassword = users[username];
      if (!userPassword) { return done(null, false); }
      if (userPassword !== password) { return done(null, false); }
      return done(null, username);
  }
));

app.get('/api/auth',passport.authenticate('basic', {session: false}),function (req, res) {
        res.json({"hello": req.user})
    }
);


app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(routes);

app.listen(3000, function(){
    console.log("Imani, your app is running on localhost:3000")
})
