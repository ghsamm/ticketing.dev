import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from "@ghsamm-org/common/build/middlewares/validate-request";
import { requireAuth } from "@ghsamm-org/common/build/middlewares/require-auth";
import { currentUser } from "@ghsamm-org/common/build/middlewares/current-user";
import { NotFoundError } from "@ghsamm-org/common/build/errors/not-found-error";
import { UnauthorizedError } from "@ghsamm-org/common/build/errors/unauthorized-error";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  currentUser,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (req.currentUser!.id !== ticket.userId) {
      throw new UnauthorizedError();
    }

    ticket.set(req.body);

    await ticket.save();

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
