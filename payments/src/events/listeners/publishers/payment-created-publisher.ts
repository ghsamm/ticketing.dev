import { PaymentCreatedEvent, Publisher, Subjects } from "@ghsamm-org/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}