const UserRouter = require("./user");
const TaskRouter = require("./task");

function route(app) {
  app.use("/user", UserRouter);
  app.use("/task", TaskRouter);
}
module.exports = route;
