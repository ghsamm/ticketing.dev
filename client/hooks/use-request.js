import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body }) => {
  const [errors, setErrors] = useState([]);

  const doRequest = async (props = {}) => {
    setErrors([]);

    try {
      const response = await axios[method](url, { ...body, ...props });

      return response.data;
    } catch (err) {
      console.log(err);
      setErrors(err.response.data.errors);
      throw err;
    }
  };

  return { doRequest, errors };
};

export default useRequest;
