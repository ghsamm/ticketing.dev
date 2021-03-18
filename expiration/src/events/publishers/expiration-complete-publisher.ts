import { ExpirationCompleteEvent, Publisher, Subjects } from "@ghsamm-org/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}