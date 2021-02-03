import { OrderCancelledEvent } from "@ghsamm-org/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWraper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWraper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = await Ticket.build({
    title: "concert",
    price: 447,
    userId: "adf",
  });

  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, ticket, orderId, listener };
};

it("updates the ticket, publishes an event and acks the message", async () => {
  const { msg, data, ticket, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWraper.client.publish).toHaveBeenCalled();
});
