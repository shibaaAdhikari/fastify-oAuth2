import fp from "fastify-plugin";
({ logger: { level: "trace" } });
import sget from "simple-get";
// const oauthPlugin = require('fastify-oauth2')
import oauthPlugin from "@fastify/oauth2";
export default fp(async (fastify, opts) => {
  fastify.register(oauthPlugin, {
    name: "googleOAuth2",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/login/google",
    callbackUri: "http://localhost:3000/",
  });

  fastify.get("/login/google/callback", async function (request, reply) {
    try {
      const result =
        await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          request
        );

      if (!result || !result.token || !result.token.access_token) {
        reply.send(new Error("Invalid access token"));
        return;
      }

      const { access_token } = result.token;

      const { body } = await sget.promise.concat({
        url: "https://www.googleapis.com/oauth2/v2/userinfo",
        method: "GET",
        headers: {
          Authorization: "Bearer " + access_token,
        },
        json: true,
      });

      reply.send(body);
    } catch (error) {
      reply.send(error);
    }
  });
});
