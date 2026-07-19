const {z} = require("zod");

const demoSeedSchema = z
  .object({
    reset: z.boolean().optional().default(true)
  })
  .default({reset: true});

module.exports = {demoSeedSchema};
