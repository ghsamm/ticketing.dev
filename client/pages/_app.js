import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/Header";

const App = ({ Component, pageProps, ...props }) => {
  return (
    <div>
      <Header currentUser={props.currentUser} />
      <Component {...pageProps} {...props} />
    </div>
  );
};

App.getInitialProps = async ({ ctx, Component }) => {
  const client = buildClient(ctx);
  const pageProps =
    typeof Component.getInitialProps !== "function"
      ? {}
      : await Component.getInitialProps(ctx);

  const { data } = await client.get("/api/users/current-user");
  return { pageProps, ...data };
};

export default App;
