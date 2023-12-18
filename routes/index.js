import tasks from "./tasks.js";
import users from "./users.js";
import login from "./login.js";
import logout from "./logout.js";
import register from "./register.js";
import schedule from "./schedule.js";

const constructorMethod = (app) => {
  app.use("/tasks", tasks);
  app.use("/users", users);
  app.use("/login", login);
  app.use("/logout", logout);
  app.use("/register", register);
  app.use("/schedule", schedule);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};
export default constructorMethod;
