import axios from 'axios';

const PAYSTACK_BASE = 'https://api.paystack.co';

export const paystack = axios.create({
  baseURL: PAYSTACK_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Read the secret key fresh on every request (avoids module-cache stale key)
paystack.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.PAYSTACK_SECRET_KEY}`;
  return config;
});
