import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
});

// Ini akan menangani token yang kedaluwarsa (401) secara otomatis
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Cek jika error 401 dan bukan request ke 'refresh-token'
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Jika sudah ada proses refresh, tunggu promise-nya
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return instance(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Panggil endpoint refresh token
                await axios.post('http://localhost:3000/api/auth/refresh-token', {}, {
                    withCredentials: true,
                });

                // Ulangi request asli yang gagal
                processQueue(null, null);
                return instance(originalRequest);

            } catch (refreshError) {
                // Jika refresh gagal (misal refresh token juga hangus), logout
                processQueue(refreshError, null);

                // Panggil logout dari window (cara untuk mengakses fungsi di luar React context)
                // Ini akan memaksa redirect ke halaman login
                window.dispatchEvent(new Event('logout-event'));

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default instance;