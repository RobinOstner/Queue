import Vue from 'vue';
import axios from "axios";
import apiJwtToken from "./helper/jwtInterceptors";

const baseURL = process.env.NODE_ENV === "production" ? "" : "http://localhost:5000/api/";

const request = axios.create({
	baseURL
});

apiJwtToken(request);

export default request;