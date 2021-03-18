import { UndefinedEnvVariable } from "@ghsamm-org/common/build/errors/undefined-env-variable";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWraper } from "./nats-wrapper";

const startup = async () => {

  if (!process.env.NATS_URL) {
    throw new UndefinedEnvVariable("NATS_URL");
  }

  if (!process.env.NATS_CLUSTER) {
    throw new UndefinedEnvVariable("NATS_CLUSTER");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new UndefinedEnvVariable("NATS_CLIENT_ID");
  }

  if (!process.env.REDIS_HOST) {
    throw new UndefinedEnvVariable("REDIS_HOST");
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

    new OrderCreatedListener(natsWraper.client).listen()

  } catch (err) {
    console.error(err);
  }

};

startup();
