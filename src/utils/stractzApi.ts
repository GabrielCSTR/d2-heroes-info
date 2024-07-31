import axios from "axios";
const headers = {
    'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
}
export const API_URL = import.meta.env.VITE_API_URL;
export const stractzApi = axios.create({
    baseURL: API_URL,
    headers
})