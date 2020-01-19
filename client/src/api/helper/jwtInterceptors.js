import store from './../../store';
import jwt from "./../jwt/index"
import { RetryError } from "./../../exception/retryError"

export default function apiJwtToken(axios) {

	axios.interceptors.request.use(function(config) {
		const accessToken = store.getters["accessTokens/token"];
		const queueId = store.getters["queue/getQueueID"]

		if(accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		if(queueId) {
			config.headers["x-queue-id"] = queueId;
		}

		return config;
	}, function(err) {
		return Promise.reject(err);
	});

	axios.interceptors.response.use(function(response) {
		if (response.data.hasOwnProperty("token")) {
			store.commit('accessTokens/SET_TOKEN', response.data.token);
		}

		return response;
	},  async function(err) {
		if(err.response.status == 401) {
			let error = err.response.data.error;

			if(error.code == 1 && error.subcode == 1) {
				var respones = await jwt.refreshToken()
				console.log(respones.data.req);
				return Promise.reject(new RetryError("user credentials refreshed"))
			}

			if(error.code == 1 && error.subcode == 2) {
				//ToDo unauthoorized flow
				console.log("unauthorized flow")
			}
		}

		return Promise.reject(err);
	});
}