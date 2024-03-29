import store from './../../store';
import jwt from "./../jwt/index"
import { RetryError } from "./../../exception/retryError"

export default function apiJwtToken(axios) {
	let timer;

	axios.interceptors.request.use(function(config) {
		const accessToken = store.getters["accessTokens/token"];
		const queueID = store.getters["queue/getQueueID"]

		if(accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		if(queueID) {
			config.headers["x-queue-id"] = queueID;
		}

		return config;
	}, function(err) {
		return Promise.reject(err);
	});

	axios.interceptors.response.use(function(response) {
		if (response.data.hasOwnProperty("token")) {
			store.commit('accessTokens/SET_TOKEN', response.data.token);

			if(timer) {
				clearTimeout(timer);
				timer = null;
			}

			//10 min timer token lasts 15min
			timer = setTimeout(refreshTokenAfterTime, 600000);
		}

		return response;
	},  async function(err) {
		if(err.response.status == 401) {
			let error = err.response.data.error;

			if(error.code == 1 && error.subcode == 1) {
				var respones = await jwt.refreshToken();

				return Promise.reject(new RetryError("user credentials refreshed"))
			}

			if(error.code == 1 && error.subcode == 2) {
				//ToDo unauthoorized flow
				console.log("unauthorized flow")
			}
		}

		return Promise.reject(err);
	});

	async function refreshTokenAfterTime() {
		timer = null;
		await jwt.refreshToken();
	}
}