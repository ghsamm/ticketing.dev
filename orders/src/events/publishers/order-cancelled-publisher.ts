import { Publisher, Subjects, OrderCancelledEvent } from "@ghsamm-org/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
