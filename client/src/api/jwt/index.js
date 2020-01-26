import request from "./../apiRequest";

export default {
	//TODO block all other requests
	refreshToken: async function () {
		return request.post("jwt/refreshToken", {}, {
			withCredentials: true,
		});
	},
};