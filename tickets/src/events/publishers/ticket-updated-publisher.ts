import { Publisher } from "@ghsamm-org/common/build/events/base-publisher";
import { Subjects } from "@ghsamm-org/common/build/events/subjects";
import { TicketUpdatedEvent } from "@ghsamm-org/common/build/events/ticket-updated-event";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
