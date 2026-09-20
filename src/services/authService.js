const BASE_URL = 'https://your-api-endpoint.com';

/**
 * دالة تسجيل الدخول وإرسال البيانات للـ API
 * @param {Object} credentials - تحتوي على email و password
 * @returns {Promise<Object>} البيانات القادمة من السيرفر
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to sign in. Please try again.');
    }

    return data; 
  } catch (error) {
    throw error;
  }
};
