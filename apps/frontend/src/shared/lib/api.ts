import axios from "axios";

import { getErrorMessage } from "./errors";

export const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(new Error(getErrorMessage(error))),
);
