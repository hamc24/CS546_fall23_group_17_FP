// Prototypical router method just to make sure we can get something very primitive, we really should decide EXACTLY how the routes will be handled though.

const constructorMethod = (app) => {
  app.use('/tasks', tasks);
  app.use('/users', users);

  app.use('*', (req, res) => {
    return res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;
