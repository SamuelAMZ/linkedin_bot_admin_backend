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
const NewAppAccountRoute = require("./api/routes/appRoutes/settings/account/newAccount");
const EditAppAccountRoute = require("./api/routes/appRoutes/settings/account/editAccount");
const RemoveAppAccountRoute = require("./api/routes/appRoutes/settings/account/removeAccount");
const SingleAppAccountRoute = require("./api/routes/appRoutes/settings/account/singleAccount");
const AllAppAccountsRoute = require("./api/routes/appRoutes/settings/account/allAccounts");
const NewAppProfileRoute = require("./api/routes/appRoutes/settings/profile/newProflie");
const EditAppProfileRoute = require("./api/routes/appRoutes/settings/profile/editProfile");
const RemoveAppProfileRoute = require("./api/routes/appRoutes/settings/profile/removeProfile");
const SingleAppProfileRoute = require("./api/routes/appRoutes/settings/profile/singleProfile");
const AllAppProfilesRoute = require("./api/routes/appRoutes/settings/profile/allProfiles");
const SelectionSingleSearch = require("./api/routes/appRoutes/SelectionSingleSearch");
const SingleSearchSummaryRoute = require("./api/routes/appRoutes/SingleSearchSummary");
const SingleSearchSummaryInfo = require("./api/routes/appRoutes/SingleSearchSummaryInfo");
const StopSearchRoute = require("./api/routes/appRoutes/stopSearch");

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

/*   
    @desc: new app account     
    @method: POST
    @privacy: public
    @endpoint: /api/new-app-account
*/
app.use("/api/new-app-account", NewAppAccountRoute);

/*   
    @desc: edit app account
    @method: POST
    @privacy: public
    @endpoint: /api/edit-app-account
*/
app.use("/api/edit-app-account", EditAppAccountRoute);

/*   
    @desc: remove app account
    @method: POST
    @privacy: public
    @endpoint: /api/remove-app-account
*/
app.use("/api/remove-app-account", RemoveAppAccountRoute);

/*   
    @desc: single app account
    @method: POST
    @privacy: public
    @endpoint: /api/single-app-account
*/
app.use("/api/single-app-account", SingleAppAccountRoute);

/*   
    @desc: all app accounts
    @method: POST
    @privacy: public
    @endpoint: /api/all-app-accounts
*/
app.use("/api/all-app-accounts", AllAppAccountsRoute);

/*   
    @desc: single app account
    @method: POST
    @privacy: public
    @endpoint: /api/new-profile-account
*/
app.use("/api/new-profile-account", NewAppProfileRoute);

/*   
    @desc: edit app profile
    @method: POST
    @privacy: public
    @endpoint: /api/edit-app-profile
*/
app.use("/api/edit-app-profile", EditAppProfileRoute);

/*   
    @desc: remove app profile
    @method: POST
    @privacy: public
    @endpoint: /api/remove-app-profile
*/
app.use("/api/remove-app-profile", RemoveAppProfileRoute);

/*   
    @desc: single app profile
    @method: POST
    @privacy: public
    @endpoint: /api/single-app-profile
*/
app.use("/api/single-app-profile", SingleAppProfileRoute);

/*   
    @desc: all app proflies
    @method: POST
    @privacy: public
    @endpoint: /api/all-app-profiles
*/
app.use("/api/all-app-profiles", AllAppProfilesRoute);

/*   
    @desc: update single job selection
    @method: POST
    @privacy: public
    @endpoint: /api/update-single-job-selection
*/
app.use("/api/update-single-job-selection", SelectionSingleSearch);

/*   
    @desc: single search summary data
    @method: POST
    @privacy: public
    @endpoint: /api/single-search-summary-data
*/
app.use("/api/single-search-summary-data", SingleSearchSummaryRoute);

/*   
    @desc: single search summary info
    @method: POST
    @privacy: public
    @endpoint: /api/single-search-summary-info
*/
app.use("/api/single-search-summary-info", SingleSearchSummaryInfo);

/*   
    @desc: stop search
    @method: POST
    @privacy: public
    @endpoint: /api/stope-search
*/
app.use("/api/stop-search", StopSearchRoute);

app.listen(process.env.PORT, () =>
  console.log(`app listen on port ${process.env.PORT}`)
);
