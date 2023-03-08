const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const timeout = require("connect-timeout");

// app routes
const NewSearchRoute = require("./api/routes/appRoutes/NewSearch");
const SingleSearchRoute = require("./api/routes/appRoutes/SingleSearch");
const HomeAnalytics = require("./api/routes/appRoutes/HomeAnalyticsRoute");
const PaginationRoute = require("./api/routes/appRoutes/Pagination");
const RemoveTableItemRoute = require("./api/routes/appRoutes/RemoveTableItem");

// auth routes
const newAccountRoute = require("./api/routes/authRoutes/NewAccount");
const LoginRoute = require("./api/routes/authRoutes/LoginRoute");
const isLoginRoute = require("./api/routes/authRoutes/isLogin");
const LogoutRoute = require("./api/routes/authRoutes/Logout");

// timeout
app.use(timeout(600000));
// body parsing
app.use(express.json());
// cookies
app.use(cookieParser());
// cors
app.use(
  cors({
    origin: process.env.DOMAIN,
    credentials: true,
    optionSuccessStatus: 200,
  })
);

// connect mongoose
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to db");
  }
});

// set headers globally
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": process.env.DOMAIN,
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  });
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("Server up");
});

/*   
    @desc: new search
    @method: POST
    @privacy: public
    @endpoint: /api/new
*/
app.use("/api/new", NewSearchRoute);

/*   
    @desc: single search page
    @method: POST
    @privacy: public
    @endpoint: /api/singleSearch
*/
app.use("/api/singleSearch", SingleSearchRoute);

/*   
    @desc: home analytics
    @method: POST
    @privacy: public
    @endpoint: /api/homeAnalytics
*/
app.use("/api/homeAnalytics", HomeAnalytics);

/*   
    @desc: pagination
    @method: POST
    @privacy: public
    @endpoint: /api/pagination
*/
app.use("/api/pagination", PaginationRoute);

/*   
    @desc: new account
    @method: POST
    @privacy: public
    @endpoint: /api/new-account
*/
app.use("/api/new-account", newAccountRoute);

/*   
    @desc: login
    @method: POST
    @privacy: public
    @endpoint: /api/login
*/
app.use("/api/login", LoginRoute);

/*   
    @desc: check if login
    @method: GET
    @privacy: public
    @endpoint: /api/is-login
*/
app.use("/api/is-login", isLoginRoute);

/*   
    @desc: logout
    @method: GET
    @privacy: public
    @endpoint: /api/logout
*/
app.use("/api/logout", LogoutRoute);

/*   
    @desc: remove domain
    @method: POST
    @privacy: public
    @endpoint: /api/remove-table-item
*/
app.use("/api/remove-table-item", RemoveTableItemRoute);

app.listen(process.env.PORT, () =>
  console.log(`app listen on port ${process.env.PORT}`)
);
