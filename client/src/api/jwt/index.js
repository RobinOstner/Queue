import request from "./../apiRequest";
import store from './../../store';


export default {
	//TODO block all other requests
	refreshToken: async function () {
		if(store.getters("auth/getIsHost")) {
			return request.post("auth/refreshTokenHost", {}, {
				withCredentials: true,
			});
		}

		return request.post("auth/refreshTokenClient", {}, {
			withCredentials: true,
		});
	},
};