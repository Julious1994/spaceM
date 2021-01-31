// import AsyncStorage from '@react-native-community/async-storage';

const joinURL = (baseURL, url, joiner) => {
	return `${baseURL}${joiner}/${url}`;
};

let Headers = {
	'Content-Type': 'application/json',
};

class Service {
	constructor(props = {}) {
		this.baseURL = 'https://spacem.in/api';
		this.token = props.token;
	}

	request(url, method = 'POST', data = null, otherOptions = {}) {
		const {joiner = '/HomeApi'} = otherOptions;
		url = joinURL(this.baseURL, url, joiner);
		const {json = true} = otherOptions;
		if (this.token) {
			Headers['Authorization'] = this.token;
		}
		if (otherOptions.headers) {
			Headers = {
				...Headers,
				...otherOptions.headers,
			};
		}
		const options = {
			headers: Headers,
			method,
		};
		if (otherOptions.formData) {
			delete options.headers;
		}
		if (data && json) {
			options.body = JSON.stringify({...data});
		} else if (data && !otherOptions.json) {
			options.body = data;
		}
		console.log(url, options);
		return fetch(url, options);
	}

	getAll(url, data = {}) {
		const method = 'POST';
		this.request(url, method, data);
	}

	get(url, otherOptions) {
		const method = 'GET';
		return this.request(url, method, null, otherOptions)
			.then((res) => {
				console.log('GET', res);
				return res.json();
			})
			.catch((err) => {
				console.log('ERR:', err);
				return {Status: 0, error: 'Network request failed'};
			});
	}

	post(url, data, otherOptions) {
		const method = 'POST';
		return this.request(url, method, data, otherOptions)
			.then(async (res) => {
				console.log('poS', res);
				const result = await res.json();
				return {res: result, status: res.status};
			})
			.catch((err) => {
				console.log('ERR:', err);
				return {Status: 0, Body: 'Network request failed'};
			});
	}

	put(url, data, otherOptions) {
		const method = 'PUT';
		return this.request(url, method, data, otherOptions)
			.then((res) => res.json())
			.catch((err) => {
				console.log('ERR:', err);
				return {Status: 0, Body: 'Network request failed'};
			});
	}

	uploadFile(url, data, otherOptions) {
		const method = 'POST';

		const options = {
			...otherOptions,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				accept: '*',
			},
			json: false,
		};
		console.log(data);
		return this.request(url, method, data, options);
	}

	delete(url, data, otherOptions) {
		const method = 'DELETE';
		return this.request(url, method, data, otherOptions)
			.then((res) => res.json())
			.catch((err) => {
				console.log('ERR:', err);
				return {Status: 0, Body: 'Network request failed'};
			});
	}
}

export default Service;
