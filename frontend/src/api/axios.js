import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // critical — sends httpOnly cookies with every request
});

export default api;