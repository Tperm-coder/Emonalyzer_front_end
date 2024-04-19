import axios from 'axios';

class CustomAxios {
	constructor(baseURL) {
		this.api = axios.create({ baseURL });
		this.headers = {
			'Content-Type': 'application/json',
		};
	}

	async get({ endpoint, headers = {} }) {
		try {
			const response = await this.api.get(endpoint, { headers });
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	async post({ endpoint, body, headers = {} }) {
		try {
			console.log(endpoint);
			const response = await this.api.post(endpoint, body, { ...this.headers, headers });
			return response.data;
		} catch (error) {
			throw error;
		}
	}
}

export default CustomAxios;
