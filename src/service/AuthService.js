import axios from 'axios';

// const API_URL = 'http://127.0.0.1:8000/v1/auth/admin/api/login';
const API_URL = 'https://crucial-gerrilee-hour-cadf9ee0.koyeb.app/v1/auth/admin/api/login';

export const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL, { email, password }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Ensure to return the necessary data based on your API response
        if (response.data.status === 200) {
            return {
                success: true,
                accessToken: response.data.data.jwt.access_token,
                refreshToken: response.data.data.refresh_token,
                message: response.data.message,
            };
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        // Log the error response if available
        console.error('Login failed:', error.response ? error.response.data : error.message);
        // Return a structured error response
        return {
            success: false,
            message: error.response?.data?.detail || 'An unexpected error occurred. Please try again.'
        };
    }
};
