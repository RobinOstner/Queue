const state = {
	token: "",
};

const getters = {
	token: state => state.token,
};

const mutations = {
	SET_TOKEN(state, token) {
		state.token = token;
	},
};

const module = {
	namespaced: true,
	state,
	getters,
	mutations
}

export default module;