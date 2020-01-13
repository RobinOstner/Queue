import axios from "axios";

//TODO ADD PRODUCTION BASEURL

const baseURL = process.env.NODE_ENV === "production" ? "" : "http://localhost:5000/api/auth";

const request = axios.create({
  baseURL
});

export default request;
