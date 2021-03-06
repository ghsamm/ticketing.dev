import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser } from "@ghsamm-org/common/build/middlewares/current-user";
import { errorHandler } from "@ghsamm-org/common/build/middlewares/error-handler";

import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);

app.use(errorHandler);

app.use(createChargeRouter)

export { app };
