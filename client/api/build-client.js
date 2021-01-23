import axios from "axios";

const ingressUrl =
  "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local";

const buildClient = (context) => {
  return axios.create({
    baseURL: typeof window === "undefined" ? ingressUrl : "",
    headers: context && context.req && context.req.headers,
  });
};

export default buildClient;
