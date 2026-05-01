const {app} = require("./app");
const {cache} = require("./config/cache");
const {env} = require("./config/env");
const {pool, prisma} = require("./config/prisma");

const startServer = () => {
  const server = app.listen(env.port, () => {
    console.log(`Todo API listening on port ${env.port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await cache.disconnect();
      await prisma.$disconnect();
      await pool.end();
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  return server;
};

module.exports = {startServer};
