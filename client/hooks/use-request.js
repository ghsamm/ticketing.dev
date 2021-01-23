import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body }) => {
  const [errors, setErrors] = useState([]);

  const doRequest = async () => {
    setErrors([]);

    try {
      const response = await axios[method](url, body);

      return response.data;
    } catch (err) {
      setErrors(err.response.data.errors);
      throw err;
    }
  };

  return { doRequest, errors };
};

export default useRequest;
