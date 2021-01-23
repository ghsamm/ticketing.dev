const HomePage = ({ currentUser }) => {
  return (
    <div>
      {currentUser ? (
        <h1>Hello {currentUser.email}</h1>
      ) : (
        <h1>You are not signed in</h1>
      )}
    </div>
  );
};

export default HomePage;
