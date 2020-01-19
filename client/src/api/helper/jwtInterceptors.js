import store from './../../store';

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
	},  function(err) {
		return Promise.reject(err);
	});
}