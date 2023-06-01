// const fastify = require("fastify")({ logger: { level: "trace" } });
// const oauthPlugin = require("@fastify/oauth2");

import fastifyPlugin from "fastify-plugin";
import oauthPlugin from "@fastify/oauth2";
import fastify from "fastify";

export default fastifyPlugin(async (fastify) => {
  fastify.register(oauthPlugin, {
    name: "googleOAuth2",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: process.env.USER_ID,
        secret: process.env.USER_SECRET,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/login/google",
    callbackUri: "http://localhost:3000/login/google/callback",
  });

  fastify.decorate("authenticate", async function (req, reply, done) {
    const user = req.session.user;
    if (user === undefined) {
      reply.code(401).send({ error: "Unauthorized User" });
      return done();
    }
    done;
  });
});
