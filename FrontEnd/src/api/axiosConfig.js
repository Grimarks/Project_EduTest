import axios from 'axios';

// Atur base URL untuk semua permintaan Axios
axios.defaults.baseURL = 'http://localhost:3000/api'; // Sesuaikan jika base URL berbeda

// Penting: Izinkan pengiriman cookies dengan setiap permintaan
axios.defaults.withCredentials = true;

export default axios;