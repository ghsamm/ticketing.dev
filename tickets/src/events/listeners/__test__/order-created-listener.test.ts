import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@ghsamm-org/common";
import { Ticket } from "../../../models/ticket";
import { natsWraper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWraper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 98,
    userId: "asmdfj",
  });

  await ticket.save();

  // create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "msldkfj",
    expiresAt: "msdlfkjsdf",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket:updated event", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWraper.client.publish).toBeCalled();

  const ticketUpdateData = JSON.parse(
    (natsWraper.client.publish as jest.Mock).mock.calls[0][1]
  );

  console.log(ticketUpdateData);

  expect(ticketUpdateData.orderId).toEqual(data.id);
});
