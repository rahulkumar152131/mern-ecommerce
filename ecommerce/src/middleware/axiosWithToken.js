import axios from "axios";

const axiosWithToken = axios.create({
    baseURL: 'http://localhost:4100',  // Adjust the baseURL as needed
});

// Middleware to add the user token to every request
axiosWithToken.interceptors.request.use(config => {
    const userToken = JSON.parse(localStorage.getItem('userToken'));

    // Add the token to the headers
    // console.log(userToken);
    if (userToken) {
        config.headers.Authorization = userToken;
    }

    return config;
});
axiosWithToken.interceptors.response.use(response => response,
    error => {
        if (error.response.data === "Unauthorized") {
            localStorage.clear();
            window.location.href = "/sign-in";
        }
        return Promise.reject(error);
    }

);





// Export the configured axios instance
export const axiosWithUserToken = axiosWithToken;