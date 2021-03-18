import { ExpirationCompleteEvent } from '@ghsamm-org/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order, OrderStatus } from '../../../models/order'
import { Ticket } from "../../../models/ticket"
import { natsWraper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWraper.client)

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 875
  })

  await ticket.save()

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'sdfsd',
    expiresAt: new Date(),
    ticket,
  })

  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {
    listener,
    order,
    ticket,
    data,
    msg
  }
}

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWraper.client.publish).toHaveBeenCalled()

  const eventData = JSON.parse((natsWraper.client.publish as jest.Mock).mock.calls[0][1])

  expect(eventData.id).toEqual(order.id)
})

it('ack the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})