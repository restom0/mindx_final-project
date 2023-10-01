const UserRouter = require("./user");
// const StudentRouter = require("./student");
// const StaffRouter = require("./staff");
// const SPSORouter = require("./spso");
// const PrinterRouter = require("./printer");
// const PrintingOrderRouter = require("./printingorder");
// const PrintingOrderDetailRouter = require("./printingorderdetail");
function route(app) {
  app.use("/login", UserRouter);
  // app.use("/printer", PrinterRouter);
  // app.use("/printingorder", PrintingOrderRouter);
  // app.use("/printingorderdetail", PrintingOrderDetailRouter);
  // app.use("/student", StudentRouter);
  // app.use("/staff", StaffRouter);
  // app.use("/spso", SPSORouter);
}
module.exports = route;
