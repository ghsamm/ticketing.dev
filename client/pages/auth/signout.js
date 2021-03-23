import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const SignoutPage = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
  });

  useEffect(() => {
    (async () => {
      try {
        await doRequest();
        Router.push("/");
      } catch (err) {
        alert("Unable to log you out");
      }
    })();
  }, []);

  return <div>Signing you out...</div>;
};

export default SignoutPage;
