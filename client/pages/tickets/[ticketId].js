import { useRouter } from "next/router";
import Errors from "../../components/Errors";
import useRequest from "../../hooks/use-request";

const TicketDetails = ({ ticket }) => {
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price}</h4>
      <Errors errors={errors} />
      <button
        className="btn btn-primary"
        onClick={() => {
          doRequest()
            .then((order) => {
              router.push(`/orders/${order.id}`);
            })
            .catch((err) => {});
        }}
      >
        Purchase
      </button>
    </div>
  );
};

TicketDetails.getInitialProps = async (ctx, client) => {
  const { ticketId } = ctx.query;
  const { data: ticket } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket };
};

export default TicketDetails;
