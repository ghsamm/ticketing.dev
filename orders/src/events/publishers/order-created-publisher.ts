import { Publisher, OrderCreatedEvent, Subjects } from "@ghsamm-org/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
