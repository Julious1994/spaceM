export const initialState = {
	token: null,
	user: null,
	defaultcar: null,
	drawer: false,
	notification: null,
	loading: false,
};

export const reducer = (state, action) => {
	console.log('action', action);
	switch (action.type) {
		case 'setToken':
			return {
				...state,
				token: action.token,
			};
		case 'SET_USER':
			return {
				...state,
				user: action.userData,
			};
		case 'setCredential':
			return {
				...state,
				...action.credential,
				credential: {...action.credential},
			};
		case 'TOGGELE_DRAWER':
			return {
				...state,
				drawer: !state.drawer,
			};
		case 'Notification':
			return {
				...state,
				notification: action.notification,
			};
		case 'SET_LOADING':
			return {
				...state,
				loading: action.loading,
			};
		default:
			return state;
	}
};
