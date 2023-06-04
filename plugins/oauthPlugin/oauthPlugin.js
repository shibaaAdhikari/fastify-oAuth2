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
        id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/login/google",
    callbackUri: "http://localhost:3000/google/callback",
  });

  fastify.get("/google/callback", async function (request, reply) {
    try {
      const { token } =
        await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          request
        );
      console.log(token.access_token);
      reply.send({ access_token: token.access_token });
    } catch (error) {
      reply.send(error);
    }
  });
});
