const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getOrganizationProfile = async () => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/organization/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch organization profile.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrganizationProfile = async (profileData) => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/organization/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update organization profile.");
    }

    return result.organization_profile;
  } catch (error) {
    throw error;
  }
};

export const getOrganizationRequests = async () => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/organization/requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch organization requests.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const createOrganizationRequest = async (requestData) => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/organization/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create organization request.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getOrganizationRequest = async (requestId) => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(
      `${BASE_URL}/organization/requests/${requestId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch organization request.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const startIntakeSession = async (organizationRequestId) => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/ai/intake/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        organization_request_id: organizationRequestId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to start intake session.");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const sendIntakeMessage = async (sessionId, message) => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(
      `${BASE_URL}/ai/intake/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to send message.");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const generateSpecification = async (requestId) => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(
      `${BASE_URL}/organization/requests/${requestId}/specification/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to generate specification.");
    }

    return result;
  } catch (error) {
    throw error;
  }
};