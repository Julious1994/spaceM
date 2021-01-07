export const initialState = {
	token: null,
	user: null,
	defaultcar: null,
	drawer: false,
	notification: null,
	loading: false,
	watchList: [],
	continueWatchingList: [],
	purchasedList: [],
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
		case 'SET_PURCHASED':
			return {
				...state,
				purchasedList: action.data,
			};
		case 'ADD_PURCHASED':
			return {
				...state,
				purchasedList: [...state.purchasedList, {...action.data}],
			};
		case 'SET_WATCHLIST':
			return {
				...state,
				watchList: [...action.data],
			};
		case 'ADD_WATCHLIST':
			return {
				...state,
				watchList: [...state.watchList, {...action.data}],
			};
		case 'REMOVE_WATCHLIST':
			const list = state.watchList.filter((w) => w.VideoId !== action.id);
			return {
				...state,
				watchList: [...list],
			};
		case 'SET_CONTINUE_WATCHING':
			return {
				...state,
				continueWatchingList: [...action.data],
			};
		case 'UPDATE_CONTINUE_WATCHING':
			let watchingList = [...state.continueWatchingList];
			const index = watchingList.findIndex(
				(w) => w.VideoId === action.data.VideoId,
			);
			if (index === -1) {
				watchingList = [...watchingList, {...action.data}];
			} else {
				watchingList = state.continueWatchingList.map((c) => {
					if (c.VideoId === action.data.VideoId) {
						return {
							...c,
							WatchTime: action.data.WatchTime,
						};
					}
					return c;
				});
			}
			return {
				...state,
				continueWatchingList: [...watchingList],
			};
		default:
			return state;
	}
};
