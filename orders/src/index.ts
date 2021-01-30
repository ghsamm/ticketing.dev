import mongoose from "mongoose";

import { app } from "./app";
import { UndefinedEnvVariable } from "@ghsamm-org/common";
import { natsWraper } from "./nats-wrapper";

const startup = async () => {
  if (!process.env.JWT_KEY) {
    throw new UndefinedEnvVariable("JWT_KEY");
  }

  if (!process.env.MONGO_URI) {
    throw new UndefinedEnvVariable("MONGO_URI");
  }

  if (!process.env.NATS_URL) {
    throw new UndefinedEnvVariable("NATS_URL");
  }

  if (!process.env.NATS_CLUSTER) {
    throw new UndefinedEnvVariable("NATS_CLUSTER");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new UndefinedEnvVariable("NATS_CLIENT_ID");
  }

  try {
    await natsWraper.connect(
      process.env.NATS_CLUSTER,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    console.log("Connected to NATS");

    natsWraper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWraper.client.close());
    process.on("SIGTERM", () => natsWraper.client.close());

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
