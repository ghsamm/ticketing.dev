import express, { Request, Response } from "express";
import { NotFoundError } from "@ghsamm-org/common/build/errors/not-found-error";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    res.send(ticket);
  } catch (err) {
    throw new NotFoundError();
  }
});

export { router as showTicketRouter };
