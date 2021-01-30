import {
  NotFoundError,
  OrderStatus,
  UnauthorizedError,
} from "@ghsamm-org/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.delete("/api/orders/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new UnauthorizedError();
  }

  order.status = OrderStatus.Cancelled;

  await order.save();

  res.status(204).send({});
});

export { router as deleteOrderRouter };
