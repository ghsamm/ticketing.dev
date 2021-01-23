import express, { Request, Response } from "express";
import { requrieAuth } from "@ghsamm-org/common/build/middlewares/require-auth";

const router = express.Router();

router.post("/api/tickets", requrieAuth, (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { router as createTicketRouter };
