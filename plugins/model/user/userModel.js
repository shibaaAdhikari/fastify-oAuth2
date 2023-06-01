import { DataTypes } from "sequelize";
import fp from "fastify-plugin";

const myPlugin = async (fastify, opts, done) => {
  const User = fastify.sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  try {
    await User.sync({ force: false });
    console.log("User table created successfully");
  } catch (error) {
    console.error(error);
  }

  fastify.decorate("User", User);
  done();
};

export default fp(myPlugin);
