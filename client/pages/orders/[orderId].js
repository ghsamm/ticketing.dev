import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import StripeCheckout from "react-stripe-checkout";
import Errors from "../../components/Errors";
import useRequest from "../../hooks/use-request";

const OrderDetails = ({ order, currentUser }) => {
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
  });

  useEffect(() => {
    const calcTimeLeft = () => {
      const msBeforeExpiration = new Date(order.expiresAt) - new Date();
      const secondsBeforeExpiration = Math.round(msBeforeExpiration / 1000);
      setTimeLeft(secondsBeforeExpiration);
    };

    calcTimeLeft();
    const timerId = setInterval(calcTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      {timeLeft} seconds until order expires
      <StripeCheckout
        token={({ id }) => {
          doRequest({ token: id })
            .then((payment) => {
              router.push("/orders");
            })
            .catch((err) => {});
        }}
        stripeKey="pk_test_WOOArXnL5pUQ3Fq1Ih1IgN6O00rbZw6Ovq"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      <Errors errors={errors} />
    </div>
  );
};

OrderDetails.getInitialProps = async (ctx, client) => {
  const { orderId } = ctx.query;
  const { data: order } = await client.get(`/api/orders/${orderId}`);

  return { order };
};

export default OrderDetails;
