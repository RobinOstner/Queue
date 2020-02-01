import request from "./../apiRequest";

export default {
	//TODO block all other requests
	refreshToken: async function () {
		return request.post("auth/refreshTokenHost", {}, {
			withCredentials: true,
		});
	},
};