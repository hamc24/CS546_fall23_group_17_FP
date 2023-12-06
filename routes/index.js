// Prototypical router method just to make sure we can get something very primitive, we really should decide EXACTLY how the routes will be handled though.

import tasks from './tasks.js';
import users from './users.js';
import login from './login.js';
import register from './register.js';

const constructorMethod = (app) => {
  app.use('/tasks', tasks);
  app.use('/users', users);
  app.use('/login', login);
  app.use('/register', register);

  app.use('*', (req, res) => {
    return res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;
