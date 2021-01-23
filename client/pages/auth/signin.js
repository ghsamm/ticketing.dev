import { useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";
import Errors from "../../components/Errors";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: { email, password },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await doRequest();

      Router.push("/");
    } catch (err) {}
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign in</h1>
      <div className="form-group">
        <label>Email address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      <Errors errors={errors} />
      <button className="btn btn-primary">Sign in</button>
    </form>
  );
};

export default SigninPage;
