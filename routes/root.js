export default async function (fastify, opts) {
  fastify.get(
    "/",
    { preValidation: fastify.authenticate },
    async function (request, reply) {
      console.log("request:\n\n", request.session.token);
      return { root: true };
    }
  );
}
