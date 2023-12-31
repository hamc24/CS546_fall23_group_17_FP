// Set up an express server that we will use to recieve client requests.

import express from "express";
import session from "express-session";
import middleware from "./middleware.js";
const app = express();
import cookieParser from "cookie-parser";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + "/public");

app.use("/public", staticDir);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthState",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 600000000000 },
  })
);
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};
app.use(rewriteUnsupportedBrowserMethods);

app.use(async (req, res, next) => {
  let currTime = new Date().toUTCString();
  let reqMethod = req.method;
  let reqRoute = req.originalUrl;
  let auth = "Non-Authenticated User";
  if (req.session.user) {
    auth = "Authenticated User";
  }

  console.log(`[${currTime}]: ${reqMethod} ${reqRoute} (${auth})`);
  next();
});

app.get("/", async (req, res, next) => {
  try {
    if (!req.session.user) res.redirect("login");
    else {
      res.redirect("users");
    }
    next();
  } catch (error) {}
});

app.get("/login", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/users");
  } else {
    next();
  }
});

app.get("/register", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/users");
  } else {
    next();
  }
});

app.use('/schedule',async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  } else {
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
