import { Publisher } from "@ghsamm-org/common/build/events/base-publisher";
import { Subjects } from "@ghsamm-org/common/build/events/subjects";
import { TicketCreatedEvent } from "@ghsamm-org/common/build/events/ticket-created-event";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
