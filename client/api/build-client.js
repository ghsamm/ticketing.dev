import axios from "axios";

const domain = "http://www.ticketing-dev-ghsamm.xyz";

const buildClient = (context) => {
  return axios.create({
    baseURL: typeof window === "undefined" ? domain : "",
    headers: context && context.req && context.req.headers,
  });
};

export default buildClient;
