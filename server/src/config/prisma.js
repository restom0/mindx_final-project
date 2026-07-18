const {PrismaClient} = require("@prisma/client");
const {PrismaPg} = require("@prisma/adapter-pg");
const {Pool} = require("pg");
const {env} = require("./env");

const pool = new Pool({
  connectionString: env.databaseUrl
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});

module.exports = {pool, prisma};
