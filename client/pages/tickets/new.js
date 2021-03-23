import { useState } from "react";
import Router from "next/router";
import Errors from "../../components/Errors";
import useRequest from "../../hooks/use-request";

const withEventValue = (handler) => (event) => handler(event.target.value);

const withPreventDefault = (handler) => (event) => {
  event.preventDefault();
  return handler(event);
};

const normalizePrice = (price) => {
  const numberPrice = parseFloat(price);

  if (isNaN(numberPrice)) {
    return price;
  }

  const normalizedPrice = Math.max(0, price).toFixed(2);

  return normalizedPrice;
};

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
  });

  const submitForm = () => {
    doRequest()
      .then((ticket) => {
        Router.push("/");
      })
      .catch((err) => {});
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={withPreventDefault(submitForm)}>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={withEventValue(setTitle)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            value={price}
            onChange={withEventValue(setPrice)}
            onBlur={() => setPrice(normalizePrice(price))}
          />
        </div>
        <Errors errors={errors} />
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
