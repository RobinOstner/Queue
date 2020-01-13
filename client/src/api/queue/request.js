import axios from "axios";

const baseURL = process.env.NODE_ENV === "production" ? "" : "http://localhost:5000/api/queue";

const request = axios.create({
  baseURL
});

export default request;