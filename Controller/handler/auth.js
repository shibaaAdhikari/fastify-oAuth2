import crypto from "crypto";

const loginUser = async (req, reply) => {
  try {
    const { email, password } = req.body;

    if (!email && password) {
      reply.code(400).send("All input is required");
    }
    const User = req.server.User;
    const oldUser = await User.findOne({ where: { email } });

    if (oldUser) {
      return reply.code(409).send("User Already Exists.Please Login");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    req.session.User = { id: newUser.id, email: newUser.email };
    await req.session.save();
    reply.status(201).send({ msg: "register successfully", newUser });
  } catch (error) {
    reply.send(error);
  }
};

const logout = async (req, reply) => {
  try {
    const id = req.session.id;
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        reply.code(500).send({ message: "Session could not be cleared" });
        return;
      }
      reply.clearCookie(process.env.SESSION_COOKIE_NAME, {
        path: "/",
        httpOnly: "true",
      });
      reply.send({ message: "logged out successfully" });
    });
  } catch (error) {
    console.error(error);
    reply.code(500).send({ message: "Internal Server Error" });
  }
};

export { loginUser, logout };
