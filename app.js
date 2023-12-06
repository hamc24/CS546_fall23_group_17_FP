// Set up an express server that we will use to recieve client requests.

import express from 'express';
import session from 'express-session';
import middleware from './middleware.js';
const app = express();
import cookieParser from 'cookie-parser';
import configRoutes from './routes/index.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import exphbs from 'express-handlebars';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

app.use('/public', staticDir);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(
  session({
    name: 'AuthState',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 60000}
  })
);

app.get('/login', async (req, res, next) => {
  try {
    if (!req.session.user);
      //res.redirect('login');
    else {
      if (req.session.user.role == 'admin')
        res.redirect('/admin');
      else if (req.session.user.role == 'user')
        res.redirect('/protected');
    }
    next();
  }
  catch (error) {}
}
);

app.get('/register', async (req, res, next) => {
  try {
    if (!req.session.user);
      //res.redirect('register');
    else {
      if (req.session.user.role == 'admin')
        res.redirect('/admin');
      else if (req.session.user.role == 'user')
        res.redirect('/protected');
    }
    next();
  }
  catch (error) {}
}
);

app.get('/protected', async (req, res, next) => {
  try {
    if (!req.session.user)
      res.status(200).redirect('/login');
    else
      next();
  }
  catch (error) {}
}
);

app.get('/admin', async (req, res, next) => {
  try {
  if (!req.session.user)
    res.status(200).redirect('/login');
  else {
    if (req.session.user.role == 'admin')
      next();
    else if (req.session.user.role == 'user')
      res.status(403).redirect('/error');
  }
  //next();
  }
  catch (error) {}
}
);

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
