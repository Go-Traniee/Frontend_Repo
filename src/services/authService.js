const BASE_URL = 'http://localhost:8000/api';

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

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * دالة تسجيل حساب جديد (طالب أو مؤسسة) وإرسال البيانات للـ API
 * @param {Object} formData - بيانات الفورم (تحتوي على role جاهزة بصيغة "student" أو "organization")
 * @returns {Promise<Object>} البيانات القادمة من السيرفر
 */
export const register = async (formData) => {
  try {
    const payload = {
      name: formData.role === 'student' ? formData.name : formData.orgName,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      role: formData.role,
    };

    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create account. Please try again.');
    }

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));

    return data;
  } catch (error) {
    throw error;
  }
};