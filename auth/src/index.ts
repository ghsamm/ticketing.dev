import mongoose from "mongoose";

import { app } from "./app";

const startup = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("Environment variable JWT_KEY is not defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Conntected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on PORT 3000");
  });
};

startup();
