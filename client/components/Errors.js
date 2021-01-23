import React from "react";

const Errors = ({ errors }) => {
  return (
    errors.length > 0 && (
      <div className="alert alert-danger">
        <h4>Ooops...</h4>
        <ul className="my-0">
          {errors.map((err) => (
            <li key={err.message}>{err.message}</li>
          ))}
        </ul>
      </div>
    )
  );
};

export default Errors;
