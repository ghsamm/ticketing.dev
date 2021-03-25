import mongoose from "mongoose";

import { app } from "./app";

const startup = async () => {
  console.log('Starting up...')
  if (!process.env.JWT_KEY) {
    throw new Error("Environment variable JWT_KEY is not defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Environment variable MONGO_URI is not defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
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
