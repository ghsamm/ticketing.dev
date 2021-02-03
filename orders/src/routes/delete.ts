import {
  NotFoundError,
  OrderStatus,
  UnauthorizedError,
} from "@ghsamm-org/common";
import express, { Request, Response } from "express";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { Order } from "../models/order";
import { natsWraper } from "../nats-wrapper";

const router = express.Router();

router.delete("/api/orders/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("ticket");

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new UnauthorizedError();
  }

  order.status = OrderStatus.Cancelled;

  await order.save();

  // publishing an event saying this was cancelled
  new OrderCancelledPublisher(natsWraper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(204).send({});
});

export { router as deleteOrderRouter };
