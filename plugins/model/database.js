import fp from "fastify-plugin";
import { Sequelize } from "sequelize";

const dbConnPlugin = fp(async (fastify, options) => {
  const sequelize = new Sequelize("postgres://shiba:shiba@localhost/shiba");

  try {
    // const result = await sequelize.authenticate();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw new Error("Database connection error");
  }

  fastify.decorate("sequelize", sequelize);
});

export default dbConnPlugin;
