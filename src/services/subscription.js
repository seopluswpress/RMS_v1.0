import axios from 'axios';

const API_BASE_URL = 'https://hemanth525.pythonanywhere.com/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTotalSubscriptions = (user_id) =>
  api.get(`/accounts/subscribe/`, { params: { user_id } });

export const getTotalOwners = () =>
  api.get(`/accounts/subscribe/`, { params: { type: 'owner' } });
